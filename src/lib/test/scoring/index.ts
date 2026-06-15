import type { ScoredAnswers, Subarea } from "../types";
import { SUBAREAS, SIMPLE_BLOCKS } from "../questions";
import type {
  BlockAResult,
  BlockBResult,
  BlockCResult,
  BlockDResult,
  BlockEResult,
  Compatibility,
  CriterionABState,
  CriterionCState,
  CriterionDState,
  AlertLevel,
  ScoreResult,
  SubareaResult,
  SubareaLevel,
  SupportLevel,
} from "./types";

export * from "./types";

// --- Utilidades --------------------------------------------------------------

function valuesOf(answers: ScoredAnswers, ids: string[]): number[] {
  return ids.map((id) => answers[id] ?? 0);
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const strongCount = (xs: number[]) => xs.filter((v) => v >= 2).length;

// --- Subáreas (A y B) --------------------------------------------------------

/** Umbral de puntaje para considerar activa una subárea. A=8, B=7. */
const ACTIVE_THRESHOLD = { A: 8, B: 7 } as const;

function subareaLevel(block: "A" | "B", total: number): SubareaLevel {
  if (block === "A") {
    if (total <= 4) return "baja";
    if (total <= 7) return "leve";
    if (total <= 12) return "moderada";
    return "alta";
  }
  // B (máx 15)
  if (total <= 3) return "baja";
  if (total <= 6) return "leve";
  if (total <= 10) return "moderada";
  return "alta";
}

function computeSubarea(answers: ScoredAnswers, sub: Subarea): SubareaResult {
  const values = valuesOf(
    answers,
    sub.questions.map((q) => q.id)
  );
  const total = sum(values);
  const active =
    total >= ACTIVE_THRESHOLD[sub.block] && strongCount(values) >= 2;
  return { id: sub.id, total, active, level: subareaLevel(sub.block, total) };
}

// --- Criterio A --------------------------------------------------------------

function supportLevelA(total: number): SupportLevel {
  if (total <= 35) return 1;
  if (total <= 44) return 2;
  return 3;
}

export function scoreBlockA(answers: ScoredAnswers): BlockAResult {
  const subareas = SUBAREAS.filter((s) => s.block === "A").map((s) =>
    computeSubarea(answers, s)
  );
  const total = sum(subareas.map((s) => s.total));
  const activeCount = subareas.filter((s) => s.active).length;
  const state: CriterionABState =
    activeCount === 3 ? "compatible" : activeCount === 2 ? "parcial" : "bajo";
  const supportLevel: SupportLevel =
    state === "compatible" ? supportLevelA(total) : 0;
  return { total, subareas, activeCount, state, supportLevel };
}

// --- Criterio B --------------------------------------------------------------

function supportLevelB(total: number): SupportLevel {
  if (total <= 38) return 1;
  if (total <= 49) return 2;
  return 3;
}

export function scoreBlockB(answers: ScoredAnswers): BlockBResult {
  const subareas = SUBAREAS.filter((s) => s.block === "B").map((s) =>
    computeSubarea(answers, s)
  );
  const total = sum(subareas.map((s) => s.total));
  const activeCount = subareas.filter((s) => s.active).length;
  const state: CriterionABState =
    activeCount >= 2 ? "compatible" : activeCount === 1 ? "parcial" : "bajo";
  const supportLevel: SupportLevel =
    state === "compatible" ? supportLevelB(total) : 0;
  return { total, subareas, activeCount, state, supportLevel };
}

// --- Criterios C, D, E -------------------------------------------------------

function blockValues(answers: ScoredAnswers, id: "C" | "D" | "E"): number[] {
  const blk = SIMPLE_BLOCKS.find((b) => b.id === id)!;
  return valuesOf(
    answers,
    blk.questions.map((q) => q.id)
  );
}

export function scoreBlockC(answers: ScoredAnswers): BlockCResult {
  const total = sum(blockValues(answers, "C"));
  const state: CriterionCState =
    total <= 2 ? "bajo" : total <= 5 ? "dudoso" : "positivo";
  return { total, state };
}

export function scoreBlockD(answers: ScoredAnswers): BlockDResult {
  const values = blockValues(answers, "D");
  const total = sum(values);
  const state: CriterionDState =
    total <= 4 ? "bajo" : total <= 9 ? "parcial" : "positivo";
  return { total, state, important: values.some((v) => v === 3) };
}

export function scoreBlockE(answers: ScoredAnswers): BlockEResult {
  const total = sum(blockValues(answers, "E"));
  const alert: AlertLevel =
    total <= 2
      ? "sin_alerta"
      : total <= 6
        ? "leve"
        : total <= 11
          ? "moderada"
          : "alta";
  return { total, alert };
}

// --- Integración final -------------------------------------------------------

export interface CriterionStates {
  a: CriterionABState;
  b: CriterionABState;
  c: CriterionCState;
  d: CriterionDState;
  e: AlertLevel;
}

/**
 * Combina los criterios en una compatibilidad orientativa.
 * Regla conservadora: ante señales sin sustento (sin inicio temprano, sin
 * impacto funcional) o alertas relevantes, devuelve "inconcluso" para
 * empujar a evaluación profesional, nunca a una conclusión diagnóstica.
 */
export function integrate(s: CriterionStates): Compatibility {
  const bothSignals = s.a !== "bajo" && s.b !== "bajo";
  const highAlert = s.e === "alta";
  const modOrHighAlert = s.e === "moderada" || s.e === "alta";

  // 1. Alta compatibilidad: estructura completa presente.
  if (
    s.a === "compatible" &&
    s.b === "compatible" &&
    s.c === "positivo" &&
    s.d === "positivo" &&
    !highAlert
  ) {
    return "alta";
  }

  // 2. Baja: poca o nula estructura entre A y B.
  if ((s.a === "bajo" || s.b === "bajo") && s.c === "bajo" && s.d === "bajo") {
    return "baja";
  }

  // 3. Inconcluso: hay señales en A y B, pero falta inicio temprano (C bajo),
  //    falta impacto funcional (D bajo), o hay alerta diferencial relevante.
  if (bothSignals && (s.c === "bajo" || s.d === "bajo" || modOrHighAlert)) {
    return "inconcluso";
  }
  if (highAlert) return "inconcluso";

  // 4. Moderada: señales en A y B con inicio temprano e impacto al menos parciales.
  if (bothSignals && s.c !== "bajo" && s.d !== "bajo") {
    return "moderada";
  }

  // 5. Resto: estructura insuficiente.
  if (s.a === "bajo" || s.b === "bajo") return "baja";
  return "inconcluso";
}

// --- Orquestador -------------------------------------------------------------

export function scoreTest(answers: ScoredAnswers): ScoreResult {
  const a = scoreBlockA(answers);
  const b = scoreBlockB(answers);
  const c = scoreBlockC(answers);
  const d = scoreBlockD(answers);
  const e = scoreBlockE(answers);
  const compatibility = integrate({
    a: a.state,
    b: b.state,
    c: c.state,
    d: d.state,
    e: e.alert,
  });
  return { a, b, c, d, e, compatibility };
}
