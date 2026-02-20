import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || !["ADMIN", "SUPERADMIN"].includes(role)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar role={role} username={session.user?.name || ""} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
