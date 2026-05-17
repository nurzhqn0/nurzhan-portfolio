import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProjectCardProps = {
  project: {
    title: string;
    slug: string;
    summary: string;
    role: string;
    techStack: string[];
    images: { url: string; alt: string }[];
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const image = project.images[0];

  return (
    <article className="group grid overflow-hidden rounded-lg border bg-card md:grid-cols-[0.9fr_1.1fr]">
      <Link
        href={`/projects/${project.slug}`}
        className="relative min-h-64 overflow-hidden bg-secondary"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-between gap-8 p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{project.role}</p>
              <h2 className="mt-2 text-2xl font-semibold">{project.title}</h2>
            </div>
            <ArrowUpRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="max-w-xl leading-7 text-muted-foreground">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
