interface Props {
  title: string;
  description: string;
}

export function SectionIntro({ title, description }: Props) {
  return (
    <div className="space-y-3 py-4">
      <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
