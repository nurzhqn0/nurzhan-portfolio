import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/schemas";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.experience.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    });

    return Response.json(items);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const data = await parseJson(request, experienceSchema);
    const item = await prisma.experience.create({ data });
    return Response.json(item, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
