import type {
  Compatibility,
  CriterionCState,
  CriterionDState,
  AlertLevel,
  SupportLevel,
} from "./scoring/types";

export type Tone = "green" | "amber" | "red" | "slate";

export const COMPATIBILITY_TEXT: Record<
  Compatibility,
  { title: string; description: string; tone: Tone }
> = {
  alta: {
    title: "Alta compatibilidad orientativa",
    description:
      "Los resultados muestran alta compatibilidad con características del espectro autista. Esta herramienta no confirma un diagnóstico, pero se recomienda realizar una evaluación clínica completa con un profesional especializado.",
    tone: "red",
  },
  moderada: {
    title: "Compatibilidad moderada · rasgos presentes",
    description:
      "Los resultados muestran presencia de rasgos asociados al espectro autista. No confirma un diagnóstico, pero sería recomendable una evaluación profesional, especialmente si estas características afectan la escuela, el trabajo, la familia o las relaciones sociales.",
    tone: "amber",
  },
  baja: {
    title: "Baja compatibilidad orientativa",
    description:
      "Los resultados muestran baja compatibilidad con rasgos del espectro autista. Si aun así existen preocupaciones importantes, se recomienda consultar con un profesional.",
    tone: "green",
  },
  inconcluso: {
    title: "Resultado no concluyente · requiere evaluación diferencial",
    description:
      "Los resultados muestran señales que requieren una evaluación diferencial. No es posible orientar con claridad la compatibilidad sin una valoración profesional, especialmente por la presencia de otros factores o por información incompleta sobre el inicio temprano o el impacto en la vida diaria.",
    tone: "slate",
  },
};

const SUPPORT_A: Record<SupportLevel, string> = {
  0: "No alcanza el umbral para orientar un nivel de apoyo en comunicación social.",
  1: "Nivel 1 · necesita apoyo. Puede comunicarse, pero suele necesitar apoyo para iniciar interacciones, mantener conversaciones, comprender señales sociales o formar relaciones.",
  2: "Nivel 2 · necesita apoyo notable. Puede presentar problemas visibles incluso con apoyo, iniciar pocas interacciones o responder de forma limitada o poco ajustada.",
  3: "Nivel 3 · necesita apoyo muy notable. Puede necesitar apoyo constante para comunicarse, responder a otros o participar en interacciones cotidianas.",
};

const SUPPORT_B: Record<SupportLevel, string> = {
  0: "No alcanza el umbral para orientar un nivel de apoyo en este dominio.",
  1: "Nivel 1 · necesita apoyo. Funciona en varios contextos, pero necesita apoyo para manejar cambios, alternar actividades, organizarse o regular respuestas ante ciertos estímulos.",
  2: "Nivel 2 · necesita apoyo notable. Dificultades marcadas y frecuentes que pueden afectar la vida diaria, las relaciones, el estudio o el trabajo.",
  3: "Nivel 3 · necesita apoyo muy notable. Puede necesitar apoyo constante para manejar cambios, regular conductas repetitivas o tolerar estímulos del ambiente.",
};

export const supportTextA = (l: SupportLevel) => SUPPORT_A[l];
export const supportTextB = (l: SupportLevel) => SUPPORT_B[l];

export const C_TEXT: Record<CriterionCState, string> = {
  positivo:
    "Varias características han estado presentes desde etapas tempranas del desarrollo o desde la infancia.",
  dudoso:
    "La información sobre el inicio temprano de estas características es parcial o poco clara. Requiere evaluación profesional más detallada.",
  bajo: "No hay suficiente evidencia de inicio temprano. Conviene revisarlo con un profesional, sobre todo si las dificultades aparecieron más tarde.",
};

export const D_TEXT: Record<CriterionDState, string> = {
  positivo:
    "Estas características generan un impacto importante en la vida diaria, las relaciones, el estudio, el trabajo, la autonomía o el bienestar emocional.",
  parcial:
    "Estas características generan algunas dificultades, con un nivel de impacto parcial o variable según el contexto.",
  bajo: "No se observa un impacto funcional significativo. Aun así, si existe malestar o preocupación, se recomienda orientación profesional.",
};

export const E_TEXT: Record<AlertLevel, string> = {
  sin_alerta:
    "No se observan factores evidentes que modifiquen de forma importante la interpretación.",
  leve: "Hay algunos datos que conviene revisar con un profesional, ya que podrían influir en la interpretación.",
  moderada:
    "Hay varios factores que requieren evaluación diferencial. No descarta rasgos compatibles, pero el resultado debe interpretarse con cautela.",
  alta: "Alta necesidad de evaluación profesional detallada. Pueden existir condiciones asociadas o explicaciones alternativas que deben revisarse.",
};

export const STATE_LABEL: Record<string, string> = {
  bajo: "Bajo",
  parcial: "Parcial",
  compatible: "Compatible",
  dudoso: "Dudoso",
  positivo: "Positivo",
  sin_alerta: "Sin alerta",
  leve: "Alerta leve",
  moderada: "Alerta moderada",
  alta: "Alerta alta",
};

export const STATE_TONE: Record<string, Tone> = {
  bajo: "green",
  parcial: "amber",
  compatible: "red",
  dudoso: "amber",
  positivo: "red",
  sin_alerta: "green",
  leve: "amber",
  moderada: "amber",
  alta: "red",
};
