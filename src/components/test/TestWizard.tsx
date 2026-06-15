import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { buildSteps, countAnswerable } from "@/lib/test/steps";
import { scoreTest } from "@/lib/test/scoring";
import type {
  Respondent,
  ScaleValue,
  ScoredAnswers,
  SpecifierAnswer,
  SpecifierAnswers,
} from "@/lib/test/types";
import { DISCLAIMER } from "@/lib/test/questions";
import { IntroForm, isRespondentValid } from "./IntroForm";
import { QuestionStep } from "./QuestionStep";
import { SpecifierStep } from "./SpecifierStep";
import { SectionIntro } from "./SectionIntro";
import { ResultView } from "./ResultView";

const STORAGE_KEY = "psico-tea-v1";

interface Persisted {
  index: number;
  respondent: Respondent;
  answers: ScoredAnswers;
  specifiers: SpecifierAnswers;
  finished: boolean;
}

const initialState: Persisted = {
  index: 0,
  respondent: { name: "", age: "", relation: "" as Respondent["relation"] },
  answers: {},
  specifiers: {},
  finished: false,
};

function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return initialState;
}

export default function TestWizard() {
  const steps = useMemo(() => buildSteps(), []);
  const totalAnswerable = useMemo(() => countAnswerable(steps), [steps]);

  const [state, setState] = useState<Persisted>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // Volver al inicio de la tarjeta al cambiar de paso.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.index, state.finished]);

  const index = Math.min(state.index, steps.length - 1);
  const step = steps[index];
  const { respondent, answers, specifiers, finished } = state;

  const answerablePos = steps
    .slice(0, index + 1)
    .filter((s) => s.kind === "question" || s.kind === "specifier").length;
  const progress = Math.round((answerablePos / totalAnswerable) * 100);

  const setAnswer = (id: string, value: ScaleValue) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));

  const setSpecifier = (id: string, value: SpecifierAnswer) =>
    setState((s) => ({ ...s, specifiers: { ...s.specifiers, [id]: value } }));

  const canAdvance = (): boolean => {
    switch (step.kind) {
      case "intro":
        return isRespondentValid(respondent);
      case "section":
        return true;
      case "question":
        return answers[step.question.id] !== undefined;
      case "specifier":
        return true; // los especificadores son opcionales
    }
  };

  const isLast = index === steps.length - 1;

  const goNext = () => {
    if (!canAdvance()) return;
    if (isLast) setState((s) => ({ ...s, finished: true }));
    else setState((s) => ({ ...s, index: index + 1 }));
  };

  const goBack = () => {
    if (finished) {
      setState((s) => ({ ...s, finished: false }));
      return;
    }
    if (index > 0) setState((s) => ({ ...s, index: index - 1 }));
  };

  const restart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(initialState);
  };

  if (finished) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <ResultView
          result={scoreTest(answers)}
          respondent={respondent}
          specifiers={specifiers}
          onRestart={restart}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {/* Progreso */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {step.kind === "question" || step.kind === "specifier"
              ? `Pregunta ${answerablePos} de ${totalAnswerable}`
              : "Cuestionario orientativo TEA"}
          </span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardContent className="pt-6">
          {step.kind === "intro" && (
            <IntroForm
              value={respondent}
              onChange={(r) => setState((s) => ({ ...s, respondent: r }))}
            />
          )}

          {step.kind === "section" && (
            <SectionIntro title={step.title} description={step.description} />
          )}

          {step.kind === "question" && (
            <QuestionStep
              question={step.question}
              sectionTitle={step.sectionTitle}
              value={answers[step.question.id]}
              onChange={(v) => setAnswer(step.question.id, v)}
            />
          )}

          {step.kind === "specifier" && (
            <SpecifierStep
              question={step.question}
              value={specifiers[step.question.id]}
              onChange={(a) => setSpecifier(step.question.id, a)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={index === 0}
          className="min-w-24"
        >
          Atrás
        </Button>
        <Button onClick={goNext} disabled={!canAdvance()} className="min-w-32">
          {isLast ? "Ver resultado" : "Siguiente"}
        </Button>
      </div>

      {step.kind === "intro" && (
        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      )}
    </div>
  );
}
