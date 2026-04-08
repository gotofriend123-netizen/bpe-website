import type { ReactNode } from "react";

import { AdminChrome } from "@/components/admin/AdminChrome";
import { requireAdminSession } from "@/lib/admin/admin-dashboard";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const currentUser = await requireAdminSession();

  return <AdminChrome currentUser={currentUser}>{children}</AdminChrome>;
}
