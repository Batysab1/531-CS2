import { prisma } from "@/lib/prisma";
import { AdminBoostChat } from "./AdminBoostChat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminBoostPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const username = session?.user?.name || "Admin";

  const chats = await prisma.boostChat.findMany({
    include: {
      user: { select: { username: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);

  return <AdminBoostChat chats={chats} adminId={userId} adminUsername={username} />;
}
