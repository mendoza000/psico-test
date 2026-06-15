import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Respondent } from "@/lib/test/types";

const RELATIONS: { value: Respondent["relation"]; label: string }[] = [
  { value: "self", label: "Soy yo mismo/a" },
  { value: "parent", label: "Madre / padre" },
  { value: "caregiver", label: "Cuidador/a o familiar" },
  { value: "professional", label: "Profesional" },
  { value: "other", label: "Otro" },
];

export const RELATION_LABEL: Record<Respondent["relation"], string> =
  Object.fromEntries(RELATIONS.map((r) => [r.value, r.label])) as Record<
    Respondent["relation"],
    string
  >;

interface Props {
  value: Respondent;
  onChange: (r: Respondent) => void;
}

export function IntroForm({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Antes de empezar</h2>
        <p className="text-sm text-muted-foreground">
          Estos datos aparecerán en el resultado para que el profesional sepa de
          quién se trata.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resp-name">Nombre de la persona evaluada</Label>
        <Input
          id="resp-name"
          value={value.name}
          placeholder="Nombre y apellido"
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resp-age">Edad</Label>
        <Input
          id="resp-age"
          type="number"
          min={0}
          inputMode="numeric"
          value={value.age}
          placeholder="Ej. 8"
          onChange={(e) => onChange({ ...value, age: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resp-relation">¿Quién responde el cuestionario?</Label>
        <Select
          value={value.relation || undefined}
          onValueChange={(v) =>
            onChange({ ...value, relation: v as Respondent["relation"] })
          }
        >
          <SelectTrigger id="resp-relation" className="w-full">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            {RELATIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function isRespondentValid(r: Respondent): boolean {
  return r.name.trim().length > 0 && r.age.trim().length > 0 && !!r.relation;
}
