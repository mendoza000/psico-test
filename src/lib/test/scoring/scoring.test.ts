import { describe, it, expect } from "vitest";
import type { ScaleValue, ScoredAnswers } from "../types";
import { SUBAREAS, SIMPLE_BLOCKS } from "../questions";
import {
  scoreBlockA,
  scoreBlockB,
  scoreBlockC,
  scoreBlockD,
  scoreBlockE,
  integrate,
  scoreTest,
} from "./index";

// --- Helpers -----------------------------------------------------------------

function allZero(): ScoredAnswers {
  const a: ScoredAnswers = {};
  for (const s of SUBAREAS) for (const q of s.questions) a[q.id] = 0;
  for (const b of SIMPLE_BLOCKS) for (const q of b.questions) a[q.id] = 0;
  return a;
}

function setSubarea(a: ScoredAnswers, id: string, values: number[]) {
  const sub = SUBAREAS.find((s) => s.id === id)!;
  sub.questions.forEach((q, i) => {
    a[q.id] = values[i] as ScaleValue;
  });
}

function fillSubarea(a: ScoredAnswers, id: string, value: ScaleValue) {
  const sub = SUBAREAS.find((s) => s.id === id)!;
  sub.questions.forEach((q) => {
    a[q.id] = value;
  });
}

function fillBlock(a: ScoredAnswers, id: string, value: ScaleValue) {
  const blk = SIMPLE_BLOCKS.find((b) => b.id === id)!;
  blk.questions.forEach((q) => {
    a[q.id] = value;
  });
}

function setBlock(a: ScoredAnswers, id: string, values: number[]) {
  const blk = SIMPLE_BLOCKS.find((b) => b.id === id)!;
  blk.questions.forEach((q, i) => {
    a[q.id] = values[i] as ScaleValue;
  });
}

// --- Criterio A --------------------------------------------------------------

describe("scoreBlockA", () => {
  it("todo en cero: total 0, ninguna subárea activa, estado bajo", () => {
    const r = scoreBlockA(allZero());
    expect(r.total).toBe(0);
    expect(r.activeCount).toBe(0);
    expect(r.state).toBe("bajo");
    expect(r.supportLevel).toBe(0);
    expect(r.subareas.every((s) => !s.active)).toBe(true);
  });

  it("subárea activa requiere ≥8 puntos Y ≥2 respuestas en 2 o 3", () => {
    const a = allZero();
    // total 8 pero solo 1 respuesta fuerte -> NO activa
    setSubarea(a, "A1", [1, 1, 1, 1, 1, 3]);
    expect(scoreBlockA(a).subareas.find((s) => s.id === "A1")!.active).toBe(false);

    // total 8 con 2 respuestas fuertes -> activa
    const b = allZero();
    setSubarea(b, "A1", [3, 3, 1, 1, 0, 0]);
    expect(scoreBlockA(b).subareas.find((s) => s.id === "A1")!.active).toBe(true);
  });

  it("1 subárea activa -> estado bajo; 2 -> parcial; 3 -> compatible", () => {
    const one = allZero();
    fillSubarea(one, "A1", 3);
    expect(scoreBlockA(one).state).toBe("bajo");

    const two = allZero();
    fillSubarea(two, "A1", 3);
    fillSubarea(two, "A2", 3);
    expect(scoreBlockA(two).state).toBe("parcial");

    const three = allZero();
    fillSubarea(three, "A1", 3);
    fillSubarea(three, "A2", 3);
    fillSubarea(three, "A3", 3);
    expect(scoreBlockA(three).state).toBe("compatible");
  });

  it("nivel de apoyo A por puntaje total cuando es compatible (3 activas)", () => {
    const low = allZero(); // 3 activas, total 24 -> N1
    setSubarea(low, "A1", [3, 3, 1, 1, 0, 0]);
    setSubarea(low, "A2", [3, 3, 1, 1, 0, 0]);
    setSubarea(low, "A3", [3, 3, 1, 1, 0, 0]);
    const lowR = scoreBlockA(low);
    expect(lowR.total).toBe(24);
    expect(lowR.supportLevel).toBe(1);

    const mid = allZero(); // total 36 -> N2
    fillSubarea(mid, "A1", 2);
    fillSubarea(mid, "A2", 2);
    fillSubarea(mid, "A3", 2);
    expect(scoreBlockA(mid).total).toBe(36);
    expect(scoreBlockA(mid).supportLevel).toBe(2);

    const high = allZero(); // total 54 -> N3
    fillSubarea(high, "A1", 3);
    fillSubarea(high, "A2", 3);
    fillSubarea(high, "A3", 3);
    expect(scoreBlockA(high).supportLevel).toBe(3);
  });
});

// --- Criterio B --------------------------------------------------------------

describe("scoreBlockB", () => {
  it("subárea B activa requiere ≥7 puntos Y ≥2 respuestas fuertes", () => {
    const a = allZero();
    setSubarea(a, "B1", [3, 3, 1, 0, 0]); // 7, 2 fuertes -> activa
    expect(scoreBlockB(a).subareas.find((s) => s.id === "B1")!.active).toBe(true);

    const b = allZero();
    setSubarea(b, "B1", [3, 1, 1, 1, 1]); // 7, 1 fuerte -> no activa
    expect(scoreBlockB(b).subareas.find((s) => s.id === "B1")!.active).toBe(false);
  });

  it("0 activas -> bajo; 1 -> parcial; ≥2 -> compatible", () => {
    const zero = allZero();
    expect(scoreBlockB(zero).state).toBe("bajo");

    const one = allZero();
    fillSubarea(one, "B1", 3);
    expect(scoreBlockB(one).state).toBe("parcial");

    const two = allZero();
    fillSubarea(two, "B1", 3);
    fillSubarea(two, "B2", 3);
    expect(scoreBlockB(two).state).toBe("compatible");
  });

  it("nivel de apoyo B por puntaje total cuando es compatible", () => {
    const mid = allZero(); // 4 subáreas a 2 = 40 -> N2
    (["B1", "B2", "B3", "B4"] as const).forEach((id) => fillSubarea(mid, id, 2));
    const r = scoreBlockB(mid);
    expect(r.total).toBe(40);
    expect(r.supportLevel).toBe(2);
  });
});

// --- Criterio C --------------------------------------------------------------

describe("scoreBlockC", () => {
  it("estados por puntaje: 0-2 bajo, 3-5 dudoso, 6-10 positivo", () => {
    const bajo = allZero();
    setBlock(bajo, "C", [1, 1, 0, 0, 0]); // 2
    expect(scoreBlockC(bajo).state).toBe("bajo");

    const dudoso = allZero();
    setBlock(dudoso, "C", [2, 2, 1, 0, 0]); // 5
    expect(scoreBlockC(dudoso).state).toBe("dudoso");

    const pos = allZero();
    fillBlock(pos, "C", 2); // 10
    expect(scoreBlockC(pos).state).toBe("positivo");
  });
});

// --- Criterio D --------------------------------------------------------------

describe("scoreBlockD", () => {
  it("estados por puntaje: 0-4 bajo, 5-9 parcial, 10-18 positivo", () => {
    const bajo = allZero();
    setBlock(bajo, "D", [1, 1, 1, 1, 0, 0]); // 4
    expect(scoreBlockD(bajo).state).toBe("bajo");

    const parcial = allZero();
    setBlock(parcial, "D", [2, 2, 2, 1, 0, 0]); // 7
    expect(scoreBlockD(parcial).state).toBe("parcial");

    const pos = allZero();
    fillBlock(pos, "D", 2); // 12
    expect(scoreBlockD(pos).state).toBe("positivo");
  });

  it("marca important cuando alguna respuesta es 3", () => {
    const a = allZero();
    setBlock(a, "D", [3, 0, 0, 0, 0, 0]); // total 3 -> bajo pero important
    const r = scoreBlockD(a);
    expect(r.state).toBe("bajo");
    expect(r.important).toBe(true);
  });
});

// --- Criterio E --------------------------------------------------------------

describe("scoreBlockE", () => {
  it("niveles de alerta: 0-2 sin, 3-6 leve, 7-11 moderada, 12-16 alta", () => {
    const sin = allZero();
    setBlock(sin, "E", [1, 1, 0, 0, 0, 0, 0, 0]); // 2
    expect(scoreBlockE(sin).alert).toBe("sin_alerta");

    const leve = allZero();
    setBlock(leve, "E", [2, 2, 2, 0, 0, 0, 0, 0]); // 6
    expect(scoreBlockE(leve).alert).toBe("leve");

    const mod = allZero();
    setBlock(mod, "E", [2, 2, 2, 2, 1, 0, 0, 0]); // 9
    expect(scoreBlockE(mod).alert).toBe("moderada");

    const alta = allZero();
    fillBlock(alta, "E", 2); // 16
    expect(scoreBlockE(alta).alert).toBe("alta");
  });
});

// --- Integración -------------------------------------------------------------

describe("integrate", () => {
  it("alta: A y B compatibles, C positivo, D positivo, sin alerta alta", () => {
    expect(
      integrate({
        a: "compatible",
        b: "compatible",
        c: "positivo",
        d: "positivo",
        e: "sin_alerta",
      })
    ).toBe("alta");
  });

  it("alerta alta degrada 'alta' a inconcluso (requiere diferencial)", () => {
    expect(
      integrate({
        a: "compatible",
        b: "compatible",
        c: "positivo",
        d: "positivo",
        e: "alta",
      })
    ).toBe("inconcluso");
  });

  it("baja: A o B bajo, C bajo y D bajo", () => {
    expect(
      integrate({ a: "bajo", b: "bajo", c: "bajo", d: "bajo", e: "sin_alerta" })
    ).toBe("baja");
  });

  it("moderada: señales parciales con C dudoso y D parcial", () => {
    expect(
      integrate({
        a: "parcial",
        b: "parcial",
        c: "dudoso",
        d: "parcial",
        e: "leve",
      })
    ).toBe("moderada");
  });

  it("inconcluso: señales en A y B pero sin impacto funcional (D bajo)", () => {
    expect(
      integrate({
        a: "compatible",
        b: "compatible",
        c: "positivo",
        d: "bajo",
        e: "sin_alerta",
      })
    ).toBe("inconcluso");
  });

  it("inconcluso: señales en A y B pero sin inicio temprano (C bajo)", () => {
    expect(
      integrate({
        a: "compatible",
        b: "compatible",
        c: "bajo",
        d: "positivo",
        e: "sin_alerta",
      })
    ).toBe("inconcluso");
  });
});

// --- End-to-end --------------------------------------------------------------

describe("scoreTest", () => {
  it("perfil de alta compatibilidad", () => {
    const a = allZero();
    SUBAREAS.forEach((s) => fillSubarea(a, s.id, 3));
    fillBlock(a, "C", 2);
    fillBlock(a, "D", 3);
    // E queda en 0 -> sin alerta
    const r = scoreTest(a);
    expect(r.a.state).toBe("compatible");
    expect(r.b.state).toBe("compatible");
    expect(r.c.state).toBe("positivo");
    expect(r.d.state).toBe("positivo");
    expect(r.e.alert).toBe("sin_alerta");
    expect(r.compatibility).toBe("alta");
  });

  it("perfil de baja compatibilidad (todo en cero)", () => {
    const r = scoreTest(allZero());
    expect(r.compatibility).toBe("baja");
  });
});
