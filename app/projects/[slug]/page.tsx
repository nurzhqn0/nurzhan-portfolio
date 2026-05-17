import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicShell } from "@/components/public-shell";
import { getPublishedProject } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) {
    notFound();
  }

  const image = project.images[0];
  const paragraphs = project.body.split("\n").filter(Boolean);

  return (
    <PublicShell>
      <article>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Button asChild variant="ghost">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>
          </Button>
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
                {project.role}
              </p>
              <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl ? (
                  <Button asChild>
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      Live demo <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                {project.sourceUrl ? (
                  <Button asChild variant="outline">
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                      Source <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border bg-secondary">
              {image ? (
                <img src={image.url} alt={image.alt} className="h-full min-h-96 w-full object-cover" />
              ) : (
                <div className="flex min-h-96 items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="border-t bg-card">
          <div className="prose-lite mx-auto max-w-3xl px-4 py-16 text-lg leading-8 text-muted-foreground sm:px-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
