import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const contacts = await prisma.contactLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    });

    return Response.json(contacts);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const data = await parseJson(request, contactSchema);
    const contact = await prisma.contactLink.create({ data });
    return Response.json(contact, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
