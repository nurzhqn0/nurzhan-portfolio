import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/schemas";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const projects = await prisma.project.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return Response.json(projects);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const data = await parseJson(request, projectSchema);
    const { images, ...projectData } = data;
    const project = await prisma.project.create({
      data: {
        ...projectData,
        images: {
          create: images,
        },
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
