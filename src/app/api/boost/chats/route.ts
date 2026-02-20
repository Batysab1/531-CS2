// POST /api/boost/chats — Create a chat
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { title, fromRank, toRank } = await req.json();
  const userId = (session.user as any).id;

  const chat = await prisma.boostChat.create({
    data: { userId, title, fromRank, toRank, status: "OPEN" },
    include: { messages: true },
  });

  return NextResponse.json({ chat });
}
