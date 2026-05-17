import { ProjectCard } from "@/components/project-card";
import { PublicShell } from "@/components/public-shell";
import { getPublishedProjects } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Projects
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
            Product-minded work with real backend shape.
          </h1>
        </div>
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
