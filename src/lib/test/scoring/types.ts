import type { SubareaId } from "../types";

export type SubareaLevel = "baja" | "leve" | "moderada" | "alta";

export interface SubareaResult {
  id: SubareaId;
  total: number;
  /** Activa según la regla del documento (umbral + ≥2 respuestas fuertes). */
  active: boolean;
  level: SubareaLevel;
}

export type CriterionABState = "bajo" | "parcial" | "compatible";
/** 0 = no aplica (criterio no compatible). 1–3 = nivel de apoyo orientativo. */
export type SupportLevel = 0 | 1 | 2 | 3;
export type CriterionCState = "bajo" | "dudoso" | "positivo";
export type CriterionDState = "bajo" | "parcial" | "positivo";
export type AlertLevel = "sin_alerta" | "leve" | "moderada" | "alta";

export interface BlockAResult {
  total: number; // 0–54
  subareas: SubareaResult[]; // A1, A2, A3
  activeCount: number;
  state: CriterionABState;
  supportLevel: SupportLevel;
}

export interface BlockBResult {
  total: number; // 0–60
  subareas: SubareaResult[]; // B1–B4
  activeCount: number;
  state: CriterionABState;
  supportLevel: SupportLevel;
}

export interface BlockCResult {
  total: number; // 0–10
  state: CriterionCState;
}

export interface BlockDResult {
  total: number; // 0–18
  state: CriterionDState;
  /** true si alguna pregunta se respondió con 3 (impacto clínicamente relevante). */
  important: boolean;
}

export interface BlockEResult {
  total: number; // 0–16
  alert: AlertLevel;
}

export type Compatibility = "baja" | "moderada" | "alta" | "inconcluso";

export interface ScoreResult {
  a: BlockAResult;
  b: BlockBResult;
  c: BlockCResult;
  d: BlockDResult;
  e: BlockEResult;
  compatibility: Compatibility;
}
