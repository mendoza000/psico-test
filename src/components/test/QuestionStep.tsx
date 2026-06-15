import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Question, ScaleValue } from "@/lib/test/types";

interface Props {
  question: Question;
  sectionTitle: string;
  value: ScaleValue | undefined;
  onChange: (v: ScaleValue) => void;
}

export function QuestionStep({ question, sectionTitle, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-primary">{sectionTitle}</p>
        <h2 className="text-lg font-semibold leading-snug sm:text-xl">
          {question.text}
        </h2>
      </div>

      <RadioGroup
        value={value !== undefined ? String(value) : ""}
        onValueChange={(v) => onChange(Number(v) as ScaleValue)}
        className="gap-2.5"
      >
        {question.options.map((opt) => {
          const id = `${question.id}-${opt.value}`;
          const selected = value === opt.value;
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
              <RadioGroupItem value={String(opt.value)} id={id} className="mt-0.5" />
              <span>{opt.label}</span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
