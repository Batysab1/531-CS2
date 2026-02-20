import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!["ADMIN", "SUPERADMIN"].includes((session?.user as any)?.role)) {
    return NextResponse.json({ error: "Sin permisos." }, { status: 403 });
  }
  const { status } = await req.json();
  const chat = await prisma.boostChat.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json({ chat });
}
