import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isStaticAdmin } from "../../static-admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (await isStaticAdmin()) redirect("/admin");
  return children;
}
