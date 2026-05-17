import { ContactLinks } from "@/components/contact-links";
import { PublicShell } from "@/components/public-shell";
import { getSiteProfile, getVisibleContacts } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [profile, contacts] = await Promise.all([
    getSiteProfile(),
    getVisibleContacts(),
  ]);
  const paragraphs = profile.longBio.split("\n").filter(Boolean);

  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            About
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">{profile.name}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {profile.headline}
          </p>
        </div>
        <div className="space-y-8">
          <div className="prose-lite rounded-lg border bg-card p-8 text-lg leading-8 text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ContactLinks contacts={contacts} />
        </div>
      </section>
    </PublicShell>
  );
}
