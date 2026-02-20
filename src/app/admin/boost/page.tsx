import { prisma } from "@/lib/prisma";
import { AdminBoostChat } from "./AdminBoostChat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminBoostPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const username = session?.user?.name || "Admin";

  const rawChats = await prisma.boostChat.findMany({
    include: {
      user: { select: { username: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);

  const chats = rawChats.map((chat) => ({
    id: chat.id,
    fromRank: chat.fromRank,
    toRank: chat.toRank,
    status: chat.status,
    user: chat.user,
    messages: chat.messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      senderName: "",
      isAdmin: m.isAdmin,
      createdAt: m.createdAt.toISOString(),
    })),
  }));

  return <AdminBoostChat chats={chats} adminId={userId} adminUsername={username} />;
}