import { requireAdminApi } from "@/lib/auth";
import { jsonError, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/contacts/[id]">,
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const data = await parseJson(request, contactSchema);
    const contact = await prisma.contactLink.update({ where: { id }, data });
    return Response.json(contact);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/contacts/[id]">,
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.contactLink.delete({ where: { id } });

    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
