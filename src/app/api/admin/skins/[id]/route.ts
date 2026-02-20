import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(s: any) { return s && ["ADMIN", "SUPERADMIN"].includes((s.user as any)?.role); }

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });
  const body = await req.json();
  const skin = await prisma.skin.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ skin });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });
  await prisma.skin.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
