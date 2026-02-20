import { prisma } from "@/lib/prisma";
import { AccountsManager } from "./AccountsManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminCuentasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const accounts = await prisma.account.findMany({
    include: { seller: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return <AccountsManager accounts={accounts} userId={userId} />;
}
