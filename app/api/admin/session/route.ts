import { clearAdminSession, createAdminSession, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || !verifyAdminPassword(password)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  await createAdminSession();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSession();
  return Response.json({ ok: true });
}
