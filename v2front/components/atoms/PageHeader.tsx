// components/atoms/PageHeader.tsx
// ATOM — Page-level title + subtitle. Pure presentational.
// Replaces inline <h1>/<p> pairs duplicated across dashboard pages.

interface PageHeaderProps {
  title: string;
  /** Optional count or description shown below the title */
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}