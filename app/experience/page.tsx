import { ExperienceList } from "@/components/experience-list";
import { PublicShell } from "@/components/public-shell";
import { getPublishedExperience } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experience = await getPublishedExperience();

  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Experience
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
            Roles, systems, and project work.
          </h1>
        </div>
        <ExperienceList items={experience} />
      </section>
    </PublicShell>
  );
}
