import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ScoreResult } from "@/lib/test/scoring/types";
import type { Respondent, SpecifierAnswers } from "@/lib/test/types";
import { SUBAREAS, SPECIFIERS, DISCLAIMER } from "@/lib/test/questions";
import { RELATION_LABEL } from "./IntroForm";
import {
  COMPATIBILITY_TEXT,
  supportTextA,
  supportTextB,
  C_TEXT,
  D_TEXT,
  E_TEXT,
  STATE_LABEL,
  STATE_TONE,
  type Tone,
} from "@/lib/test/result-text";

interface Props {
  result: ScoreResult;
  respondent: Respondent;
  specifiers: SpecifierAnswers;
  onRestart: () => void;
}

const TONE_BANNER: Record<Tone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950",
  red: "border-rose-200 bg-rose-50 text-rose-950",
  slate: "border-slate-200 bg-slate-50 text-slate-950",
};

const TONE_BADGE: Record<Tone, string> = {
  green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  red: "bg-rose-100 text-rose-800 border-rose-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

function ToneBadge({ state }: { state: string }) {
  const tone = STATE_TONE[state] ?? "slate";
  return (
    <Badge variant="outline" className={cn("font-medium", TONE_BADGE[tone])}>
      {STATE_LABEL[state] ?? state}
    </Badge>
  );
}

const subareaTitle = (id: string) =>
  SUBAREAS.find((s) => s.id === id)?.title ?? id;
const subareaMax = (id: string) => (id.startsWith("A") ? 18 : 15);

function DomainCard({
  title,
  state,
  total,
  max,
  text,
  children,
}: {
  title: string;
  state: string;
  total: number;
  max: number;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground tabular-nums">
            {total}/{max}
          </span>
          <ToneBadge state={state} />
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}

export function ResultView({ result, respondent, specifiers, onRestart }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const comp = COMPATIBILITY_TEXT[result.compatibility];

  const answeredSpecifiers = SPECIFIERS.map((q) => {
    const ans = specifiers[q.id];
    if (!ans) return null;
    const optLabel = q.options.find((o) => o.value === ans.value)?.label ?? ans.value;
    return { text: q.text, label: optLabel, detail: ans.detail };
  }).filter(Boolean) as { text: string; label: string; detail?: string }[];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      const link = document.createElement("a");
      const safeName = respondent.name.trim().replace(/\s+/g, "-") || "resultado";
      link.download = `resultado-tea-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("No se pudo generar la imagen", e);
      alert(
        "No se pudo generar la imagen. Podés tomar una captura de pantalla manualmente."
      );
    } finally {
      setDownloading(false);
    }
  };

  const today = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5">
      <div ref={cardRef} className="space-y-5 bg-background p-1">
        {/* Encabezado */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">
            Resultado orientativo · Tamizaje TEA
          </p>
          <h1 className="text-2xl font-bold">{respondent.name || "Sin nombre"}</h1>
          <p className="text-sm text-muted-foreground">
            Edad: {respondent.age || "—"} · Responde:{" "}
            {RELATION_LABEL[respondent.relation] ?? "—"} · {today}
          </p>
        </div>

        {/* Banner de compatibilidad */}
        <div className={cn("rounded-xl border p-5", TONE_BANNER[comp.tone])}>
          <h2 className="text-lg font-bold">{comp.title}</h2>
          <p className="mt-2 text-sm leading-relaxed">{comp.description}</p>
        </div>

        {/* Dominios A y B */}
        <div className="grid gap-4 md:grid-cols-2">
          <DomainCard
            title="Comunicación social (A)"
            state={result.a.state}
            total={result.a.total}
            max={54}
            text={supportTextA(result.a.supportLevel)}
          >
            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {result.a.subareas.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span>
                    {s.id} · {subareaTitle(s.id)}
                  </span>
                  <span className="tabular-nums">
                    {s.total}/{subareaMax(s.id)} {s.active ? "· activa" : ""}
                  </span>
                </div>
              ))}
            </div>
          </DomainCard>

          <DomainCard
            title="Conductas y sensorial (B)"
            state={result.b.state}
            total={result.b.total}
            max={60}
            text={supportTextB(result.b.supportLevel)}
          >
            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {result.b.subareas.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span>
                    {s.id} · {subareaTitle(s.id)}
                  </span>
                  <span className="tabular-nums">
                    {s.total}/{subareaMax(s.id)} {s.active ? "· activa" : ""}
                  </span>
                </div>
              ))}
            </div>
          </DomainCard>
        </div>

        {/* Mini-bloques C, D, E */}
        <div className="grid gap-4 md:grid-cols-3">
          <DomainCard
            title="Inicio temprano (C)"
            state={result.c.state}
            total={result.c.total}
            max={10}
            text={C_TEXT[result.c.state]}
          />
          <DomainCard
            title="Impacto funcional (D)"
            state={result.d.state}
            total={result.d.total}
            max={18}
            text={D_TEXT[result.d.state]}
          />
          <DomainCard
            title="Otras condiciones (E)"
            state={result.e.alert}
            total={result.e.total}
            max={16}
            text={E_TEXT[result.e.alert]}
          />
        </div>

        {/* Especificadores respondidos */}
        {answeredSpecifiers.length > 0 && (
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">Información complementaria</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {answeredSpecifiers.map((s, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="text-foreground">{s.text}</span> — {s.label}
                  {s.detail ? `: ${s.detail}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Disclaimer obligatorio */}
        <div className="rounded-xl border border-dashed bg-muted/40 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Importante: </strong>
            {DISCLAIMER}
          </p>
        </div>
      </div>

      {/* Acciones (fuera de la imagen exportada) */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleDownload} disabled={downloading} className="flex-1">
          {downloading ? "Generando…" : "Descargar resultado (imagen)"}
        </Button>
        <Button variant="outline" onClick={onRestart} className="flex-1">
          Empezar de nuevo
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Descargá la imagen o tomá una captura y compartila con tu profesional.
      </p>
    </div>
  );
}
