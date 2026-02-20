import { prisma } from "@/lib/prisma";
import { UsersManager } from "./UsersManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, username: true, role: true,
      isBanned: true, banReason: true, createdAt: true,
      _count: { select: { orders: true } },
    },
  }).catch(() => []);

  return <UsersManager users={users} currentRole={currentRole} />;
}
