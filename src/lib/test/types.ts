// Modelo de datos del cuestionario orientativo TEA (DSM-5-TR).
// El test es de TAMIZAJE, no diagnóstico: la puntuación orienta compatibilidad,
// nunca confirma un diagnóstico.

export type ScaleValue = 0 | 1 | 2 | 3;

export interface ScaleOption {
  value: ScaleValue;
  label: string;
}

/** Subáreas puntuables de los criterios A y B. */
export type SubareaId = "A1" | "A2" | "A3" | "B1" | "B2" | "B3" | "B4";

/** Bloques puntuables. */
export type ScoredBlockId = "A" | "B" | "C" | "D" | "E";

export interface Question {
  /** Id estable, p. ej. "A1-1", "C-3". */
  id: string;
  text: string;
  options: ScaleOption[];
}

/** Subárea de A o B (6 o 5 preguntas, escala 0–3). */
export interface Subarea {
  id: SubareaId;
  block: "A" | "B";
  title: string;
  description: string;
  questions: Question[];
}

/** Mini-bloque C, D o E (lista plana de preguntas). */
export interface SimpleBlock {
  id: "C" | "D" | "E";
  title: string;
  description: string;
  questions: Question[];
}

/** Pregunta de especificadores: no puntúa, recoge contexto clínico. */
export interface SpecifierOption {
  value: string;
  label: string;
  /** Muestra un campo de texto "¿Cuál?" cuando se elige esta opción. */
  requiresDetail?: boolean;
}

export interface SpecifierQuestion {
  id: string;
  text: string;
  options: SpecifierOption[];
  note?: string;
}

/** Respuestas a preguntas puntuables: id de pregunta -> valor de la escala. */
export type ScoredAnswers = Record<string, ScaleValue>;

/** Respuestas a especificadores: id -> opción elegida + detalle opcional. */
export type SpecifierAnswer = { value: string; detail?: string };
export type SpecifierAnswers = Record<string, SpecifierAnswer>;

/** Datos de quien responde, recogidos al inicio. */
export interface Respondent {
  name: string;
  age: string;
  /** Relación con la persona evaluada. */
  relation: "self" | "parent" | "caregiver" | "professional" | "other";
}
