import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser({
    redirectTo: "/login?next=/dashboard",
  });

  return <>{children}</>;
}

