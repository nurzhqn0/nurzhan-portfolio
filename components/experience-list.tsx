import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";

type ExperienceListProps = {
  items: {
    id: string;
    company: string;
    role: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    summary: string;
    highlights: string[];
    techStack: string[];
  }[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-lg border bg-card p-6">
          <div className="grid min-w-0 gap-4 md:grid-cols-[0.8fr_minmax(0,1.2fr)]">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </p>
              <h2 className="mt-2 overflow-wrap-anywhere text-xl font-semibold">
                {item.role}
              </h2>
              <p className="mt-1 overflow-wrap-anywhere text-muted-foreground">
                {item.company}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            <div className="min-w-0 space-y-4">
              <p className="overflow-wrap-anywhere leading-7 text-muted-foreground">
                {item.summary}
              </p>
              {item.highlights.length > 0 ? (
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="overflow-wrap-anywhere">
                      <span aria-hidden="true">• </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <Badge key={tech} className="max-w-full overflow-wrap-anywhere" variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
