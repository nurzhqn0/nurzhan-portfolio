import { requireAdmin } from "@/lib/auth";
import { AdminProviders } from "@/components/admin/admin-providers";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminProviders>{children}</AdminProviders>;
}
