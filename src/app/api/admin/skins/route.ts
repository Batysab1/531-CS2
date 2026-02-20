import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(s: any) { return s && ["ADMIN", "SUPERADMIN"].includes((s.user as any)?.role); }

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });
  const body = await req.json();
  const skin = await prisma.skin.create({ data: body });
  return NextResponse.json({ skin });
}
