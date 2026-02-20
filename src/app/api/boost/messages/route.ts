import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// GET /api/boost/messages?chatId=xxx
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  if (!chatId) return NextResponse.json({ error: "chatId requerido." }, { status: 400 });

  const userId = (session.user as any).id;
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes((session.user as any).role);

  // Verify access
  const chat = await prisma.boostChat.findUnique({ where: { id: chatId } });
  if (!chat) return NextResponse.json({ error: "Chat no encontrado." }, { status: 404 });
  if (!isAdmin && chat.userId !== userId) return NextResponse.json({ error: "Sin acceso." }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { chatId },
    include: { sender: { select: { username: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      senderName: m.sender.username,
      isAdmin: m.isAdmin,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}

// POST /api/boost/messages — Send message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { chatId, content } = await req.json();
  if (!chatId || !content?.trim()) return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });

  const userId = (session.user as any).id;
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes((session.user as any).role);

  // Verify access
  const chat = await prisma.boostChat.findUnique({ where: { id: chatId } });
  if (!chat) return NextResponse.json({ error: "Chat no encontrado." }, { status: 404 });
  if (!isAdmin && chat.userId !== userId) return NextResponse.json({ error: "Sin acceso." }, { status: 403 });

  const message = await prisma.message.create({
    data: { chatId, senderId: userId, content: content.trim(), isAdmin },
    include: { sender: { select: { username: true } } },
  });

  // Update chat updatedAt
  await prisma.boostChat.update({ where: { id: chatId }, data: { status: isAdmin ? "IN_PROGRESS" : chat.status } });

  // Broadcast via Pusher
  const payload = {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    senderName: message.sender.username,
    isAdmin: message.isAdmin,
    createdAt: message.createdAt.toISOString(),
  };
  await pusherServer.trigger(`boost-chat-${chatId}`, "new-message", payload);

  return NextResponse.json({ message: payload });
}
