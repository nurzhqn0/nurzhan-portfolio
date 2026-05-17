import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/schemas";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/projects/[id]">,
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const data = await parseJson(request, projectSchema);
    const { images, ...projectData } = data;
    const project = await prisma.$transaction(async (tx) => {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
      return tx.project.update({
        where: { id },
        data: {
          ...projectData,
          images: {
            create: images,
          },
        },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
    });

    return Response.json(project);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/projects/[id]">,
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });

    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
