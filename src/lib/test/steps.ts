import type { Question, SpecifierQuestion } from "./types";
import { SUBAREAS, SIMPLE_BLOCKS, SPECIFIERS } from "./questions";

export type SectionId = "A" | "B" | "C" | "D" | "E" | "S";

export type WizardStep =
  | { kind: "intro" }
  | { kind: "section"; id: SectionId; title: string; description: string }
  | {
      kind: "question";
      question: Question;
      sectionId: SectionId;
      sectionTitle: string;
    }
  | { kind: "specifier"; question: SpecifierQuestion };

const SECTION_INTRO: Record<
  SectionId,
  { title: string; description: string }
> = {
  A: {
    title: "Bloque A · Comunicación e interacción social",
    description:
      "Estas preguntas evalúan la reciprocidad social, la comunicación no verbal y las relaciones. Respondé pensando en cómo es habitualmente la persona, no en un día puntual.",
  },
  B: {
    title: "Bloque B · Patrones restrictivos, repetitivos y sensoriales",
    description:
      "Estas preguntas evalúan conductas repetitivas, rigidez ante cambios, intereses muy intensos y respuestas sensoriales inusuales.",
  },
  C: {
    title: "Bloque C · Inicio temprano",
    description:
      "Estas preguntas ayudan a saber si estas características estaban presentes desde la infancia o etapas tempranas del desarrollo.",
  },
  D: {
    title: "Bloque D · Impacto en la vida diaria",
    description:
      "Estas preguntas valoran cuánto afectan estas características la vida familiar, social, escolar, laboral o emocional.",
  },
  E: {
    title: "Bloque E · Otras condiciones a revisar",
    description:
      "Estas preguntas detectan otras condiciones o explicaciones que conviene revisar con un profesional. No suman ni restan compatibilidad con el espectro autista.",
  },
  S: {
    title: "Especificadores · Información complementaria",
    description:
      "Información adicional opcional que puede ser útil para el profesional. No afecta el puntaje.",
  },
};

/** Construye la lista lineal de pasos del cuestionario (una pregunta por paso). */
export function buildSteps(): WizardStep[] {
  const steps: WizardStep[] = [{ kind: "intro" }];

  const pushSection = (id: SectionId) =>
    steps.push({ kind: "section", id, ...SECTION_INTRO[id] });

  // Bloque A y B (por subáreas, mostrando el título de cada subárea).
  for (const block of ["A", "B"] as const) {
    pushSection(block);
    for (const sub of SUBAREAS.filter((s) => s.block === block)) {
      for (const q of sub.questions) {
        steps.push({
          kind: "question",
          question: q,
          sectionId: block,
          sectionTitle: sub.title,
        });
      }
    }
  }

  // Mini-bloques C, D, E.
  for (const block of SIMPLE_BLOCKS) {
    pushSection(block.id);
    for (const q of block.questions) {
      steps.push({
        kind: "question",
        question: q,
        sectionId: block.id,
        sectionTitle: block.title,
      });
    }
  }

  // Especificadores.
  pushSection("S");
  for (const q of SPECIFIERS) {
    steps.push({ kind: "specifier", question: q });
  }

  return steps;
}

/** Total de preguntas respondibles (puntuables + especificadores) para el progreso. */
export function countAnswerable(steps: WizardStep[]): number {
  return steps.filter((s) => s.kind === "question" || s.kind === "specifier")
    .length;
}
