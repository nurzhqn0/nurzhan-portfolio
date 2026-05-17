import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactLinks } from "@/components/contact-links";
import { ExperienceList } from "@/components/experience-list";
import { ProjectCard } from "@/components/project-card";
import { PublicShell } from "@/components/public-shell";
import {
  getPublishedExperience,
  getPublishedProjects,
  getSiteProfile,
  getVisibleContacts,
} from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, featuredProjects, experience, contacts] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(true),
    getPublishedExperience(2),
    getVisibleContacts(),
  ]);
  const primaryContact = contacts.find((contact) => contact.href.startsWith("mailto:"));

  return (
    <PublicShell>
      <section className="-mt-20 border-b bg-primary text-white">
        <div className="mx-auto flex h-screen max-h-screen max-w-6xl flex-col justify-center px-4 pt-20 sm:px-6">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-sm text-white/65">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </p>
            <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-[clamp(4.75rem,8vw,7rem)]">
              {profile.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              {profile.shortBio}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/projects">
                  View projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={primaryContact?.href ?? "/#contact"}>
                  Contact <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 grid gap-6 md:grid-cols-[0.85fr_1fr] md:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-accent">Selected work</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Featured projects with real implementation detail.
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <p className="max-w-md leading-7 text-muted-foreground md:text-right">
              A concise view of the systems, interfaces, and product decisions behind the work.
            </p>
            <Button asChild variant="outline">
              <Link href="/projects">
                All projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-6">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="rounded-lg border bg-card p-6 text-muted-foreground">
              Featured projects will appear here after they are published in admin.
            </p>
          )}
        </div>
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="max-w-md">
            <p className="text-sm font-medium text-accent">Experience</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Recent roles and technical focus.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              The experience section is edited from admin, so the public story stays current as new work ships.
            </p>
            <Button asChild className="mt-7" variant="outline">
              <Link href="/experience">
                Full experience <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ExperienceList items={experience} />
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 grid gap-5 rounded-lg border bg-primary p-6 text-primary-foreground sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-medium text-primary-foreground/70">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Let’s build something useful.
            </h2>
          </div>
          <p className="max-w-2xl leading-7 text-primary-foreground/75 md:justify-self-end md:text-right">
            Reach out through the channel that works best. Links are managed from the admin dashboard.
          </p>
        </div>
        <ContactLinks contacts={contacts} />
      </section>
    </PublicShell>
  );
}
