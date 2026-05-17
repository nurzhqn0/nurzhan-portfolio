import { prisma } from "@/lib/prisma";

export async function getSiteProfile() {
  const profile = await prisma.siteProfile
    .findFirst({
      orderBy: { createdAt: "asc" },
    })
    .catch(() => null);

  return (
    profile ?? {
      id: "fallback",
      name: "nurzhqn0",
      headline:
        "Software Engineer building pragmatic web products and backend systems.",
      location: "Astana, Kazakhstan",
      shortBio:
        "I build fast, maintainable applications with modern TypeScript, React, and backend systems.",
      longBio:
        "This portfolio is ready for admin-managed content. Configure Postgres, run Prisma migrations, and seed the database to replace this fallback copy.",
      avatarUrl: null,
      resumeUrl: null,
      seoTitle: "Nurzhan Izimbetov - Software Engineering",
      seoDescription:
        "Portfolio of Nurzhan Izimbetov, a software engineer building modern web applications and backend systems.",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
}

export async function getPublishedProjects(featuredOnly = false) {
  return prisma.project
    .findMany({
      where: {
        published: true,
        ...(featuredOnly ? { featured: true } : {}),
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => []);
}

export async function getPublishedProject(slug: string) {
  return prisma.project
    .findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    .catch(() => null);
}

export async function getPublishedExperience(limit?: number) {
  return prisma.experience
    .findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
      ...(limit ? { take: limit } : {}),
    })
    .catch(() => []);
}

export async function getVisibleContacts() {
  return prisma.contactLink
    .findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    })
    .catch(() => []);
}
