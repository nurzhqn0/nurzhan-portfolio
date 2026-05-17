import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://user:password@localhost:5432/nurzhan_portfolio",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.siteProfile.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "nurzhqn0",
      headline:
        "Software engineer building pragmatic web products and backend systems.",
      location: "Astana, Kazakhstan",
      shortBio:
        "I build fast, maintainable applications with modern TypeScript, React, and backend systems.",
      longBio:
        "I am a software engineer focused on shipping useful software with clear architecture, polished interfaces, and reliable backend workflows. My work spans product dashboards, CRUD systems, integrations, and portfolio-ready web experiences.",
      avatarUrl: "",
      resumeUrl: "",
      seoTitle: "Nurzhan Izimbetov - Software Engineer",
      seoDescription:
        "Portfolio of Nurzhan Izimbetov, a software engineer building modern web applications and backend systems.",
    },
  });

  const portfolio = await prisma.project.upsert({
    where: { slug: "portfolio-platform" },
    update: {},
    create: {
      title: "Editable Portfolio Platform",
      slug: "portfolio-platform",
      summary:
        "A full-stack portfolio with admin-managed projects, experience, contacts, and media.",
      body: "Built as a Next.js application with server-rendered public pages and an authenticated admin surface for editing content. The project prioritizes a strong editorial presentation while keeping backend workflows practical.",
      role: "Full-stack developer",
      techStack: ["Next.js", "React", "Postgres", "Prisma", "TailwindCSS"],
      demoUrl: "",
      sourceUrl: "",
      featured: true,
      published: true,
      sortOrder: 1,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
          alt: "Abstract architectural structure",
          caption: "Editorial visual placeholder for the portfolio platform.",
          sortOrder: 1,
        },
      },
    },
  });

  await prisma.experience.upsert({
    where: { id: "founding-full-stack" },
    update: {},
    create: {
      id: "founding-full-stack",
      company: "Independent Projects",
      role: "Full-stack Developer",
      location: "Remote",
      startDate: new Date("2023-01-01"),
      current: true,
      summary:
        "Designing and building full-stack products, admin systems, and data-backed web applications.",
      highlights: [
        "Built CRUD-heavy applications with server-rendered React frontends.",
        "Integrated relational data models, authentication, and operational dashboards.",
        "Delivered responsive user interfaces with strong attention to maintainability.",
      ],
      techStack: ["Next.js", "TypeScript", "Postgres", "Docker", "REST"],
      sortOrder: 1,
      published: true,
    },
  });

  await Promise.all([
    prisma.contactLink.upsert({
      where: { id: "contact-email" },
      update: {},
      create: {
        id: "contact-email",
        label: "Email",
        type: "email",
        value: "nurzhqn@gmail.com",
        href: "mailto:nurzhqn@gmail.com",
        sortOrder: 1,
      },
    }),
    prisma.contactLink.upsert({
      where: { id: "contact-github" },
      update: {},
      create: {
        id: "contact-github",
        label: "GitHub",
        type: "github",
        value: "github.com/nurzhqn0",
        href: "https://github.com/nurzhqn0",
        sortOrder: 2,
      },
    }),
    prisma.contactLink.upsert({
      where: { id: "contact-linkedin" },
      update: {},
      create: {
        id: "contact-linkedin",
        label: "LinkedIn",
        type: "linkedin",
        value: "linkedin.com/in/nurzhqn0",
        href: "https://linkedin.com/in/nurzhqn0",
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`Seeded ${portfolio.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
