import { z } from "zod";
import { splitCommaList, splitLines } from "@/lib/utils";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null)
  .pipe(z.string().url().nullable());

export const siteProfileSchema = z.object({
  name: z.string().trim().min(2),
  headline: z.string().trim().min(6),
  location: z.string().trim().min(2),
  shortBio: z.string().trim().min(20),
  longBio: z.string().trim().min(40),
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  seoTitle: z.string().trim().optional().transform((value) => value || null),
  seoDescription: z.string().trim().optional().transform((value) => value || null),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL slug like my-project"),
  summary: z.string().trim().min(20),
  body: z.string().trim().min(40),
  role: z.string().trim().min(2),
  techStack: z.string().transform(splitCommaList),
  demoUrl: optionalUrl,
  sourceUrl: optionalUrl,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().trim().url(),
        alt: z.string().trim().min(2),
        caption: z.string().trim().optional().transform((value) => value || null),
        sortOrder: z.coerce.number().int().default(0),
      }),
    )
    .default([]),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(2),
  role: z.string().trim().min(2),
  location: z.string().trim().optional().transform((value) => value || null),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  current: z.boolean().default(false),
  summary: z.string().trim().min(20),
  highlights: z.string().transform(splitLines),
  techStack: z.string().transform(splitCommaList),
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const contactSchema = z.object({
  label: z.string().trim().min(2),
  type: z.string().trim().min(2),
  value: z.string().trim().min(2),
  href: z.string().trim().url(),
  visible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type SiteProfileInput = z.infer<typeof siteProfileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
