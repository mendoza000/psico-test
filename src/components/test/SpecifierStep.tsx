import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SPECIFIER_DETAIL_LABEL } from "@/lib/test/questions";
import type { SpecifierQuestion, SpecifierAnswer } from "@/lib/test/types";

interface Props {
  question: SpecifierQuestion;
  value: SpecifierAnswer | undefined;
  onChange: (a: SpecifierAnswer) => void;
}

export function SpecifierStep({ question, value, onChange }: Props) {
  const selectedOption = question.options.find((o) => o.value === value?.value);
  const showDetail = selectedOption?.requiresDetail;
  const detailLabel = SPECIFIER_DETAIL_LABEL[question.id] ?? "¿Cuál?";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold leading-snug sm:text-xl">
          {question.text}
        </h2>
        {question.note && (
          <p className="text-sm text-muted-foreground">{question.note}</p>
        )}
      </div>

      <RadioGroup
        value={value?.value ?? ""}
        onValueChange={(v) => onChange({ value: v, detail: value?.detail })}
        className="gap-2.5"
      >
        {question.options.map((opt) => {
          const id = `${question.id}-${opt.value}`;
          const selected = value?.value === opt.value;
          return (
            <Label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm font-normal leading-snug transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-muted-foreground/30 hover:bg-muted/40"
              )}
            >
              <RadioGroupItem value={opt.value} id={id} className="mt-0.5" />
              <span>{opt.label}</span>
            </Label>
          );
        })}
      </RadioGroup>

      {showDetail && (
        <div className="space-y-2">
          <Label htmlFor={`${question.id}-detail`}>{detailLabel}</Label>
          <Textarea
            id={`${question.id}-detail`}
            value={value?.detail ?? ""}
            placeholder="Opcional"
            onChange={(e) =>
              onChange({ value: value!.value, detail: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
