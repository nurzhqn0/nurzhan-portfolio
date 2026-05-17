import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { siteProfileSchema } from "@/lib/schemas";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const profile = await prisma.siteProfile.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return Response.json(profile);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const data = await parseJson(request, siteProfileSchema);
    const existing = await prisma.siteProfile.findFirst({
      orderBy: { createdAt: "asc" },
    });

    const profile = existing
      ? await prisma.siteProfile.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.siteProfile.create({ data });

    return Response.json(profile);
  } catch (error) {
    return jsonError(error);
  }
}
