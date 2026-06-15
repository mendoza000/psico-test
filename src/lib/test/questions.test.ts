import { describe, it, expect } from "vitest";
import { SUBAREAS, SIMPLE_BLOCKS, SPECIFIERS } from "./questions";
import { buildSteps, countAnswerable } from "./steps";

describe("integridad de los datos del cuestionario", () => {
  it("Criterio A: 3 subáreas de 6 preguntas (18)", () => {
    const a = SUBAREAS.filter((s) => s.block === "A");
    expect(a).toHaveLength(3);
    a.forEach((s) => expect(s.questions).toHaveLength(6));
  });

  it("Criterio B: 4 subáreas de 5 preguntas (20)", () => {
    const b = SUBAREAS.filter((s) => s.block === "B");
    expect(b).toHaveLength(4);
    b.forEach((s) => expect(s.questions).toHaveLength(5));
  });

  it("Mini-bloques C=5, D=6, E=8", () => {
    const map = Object.fromEntries(
      SIMPLE_BLOCKS.map((b) => [b.id, b.questions.length])
    );
    expect(map).toEqual({ C: 5, D: 6, E: 8 });
  });

  it("57 preguntas puntuables + 6 especificadores", () => {
    const scored =
      SUBAREAS.reduce((n, s) => n + s.questions.length, 0) +
      SIMPLE_BLOCKS.reduce((n, b) => n + b.questions.length, 0);
    expect(scored).toBe(57);
    expect(SPECIFIERS).toHaveLength(6);
  });

  it("todos los ids de preguntas puntuables son únicos", () => {
    const ids = [
      ...SUBAREAS.flatMap((s) => s.questions.map((q) => q.id)),
      ...SIMPLE_BLOCKS.flatMap((b) => b.questions.map((q) => q.id)),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("escalas correctas: A/B/D con 4 opciones (0–3), C/E con 3 (0–2)", () => {
    SUBAREAS.forEach((s) =>
      s.questions.forEach((q) => expect(q.options).toHaveLength(4))
    );
    const byId = Object.fromEntries(SIMPLE_BLOCKS.map((b) => [b.id, b]));
    byId.C.questions.forEach((q) => expect(q.options).toHaveLength(3));
    byId.D.questions.forEach((q) => expect(q.options).toHaveLength(4));
    byId.E.questions.forEach((q) => expect(q.options).toHaveLength(3));
  });

  it("buildSteps produce 63 pasos respondibles", () => {
    expect(countAnswerable(buildSteps())).toBe(63);
  });
});
