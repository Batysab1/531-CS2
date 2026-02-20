import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(s: any) { return s && ["ADMIN", "SUPERADMIN"].includes((s.user as any)?.role); }
function isSuperAdmin(s: any) { return s && (s.user as any)?.role === "SUPERADMIN"; }

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });

  const body = await req.json();

  // Only SUPERADMIN can change roles
  if (body.role !== undefined && !isSuperAdmin(session)) {
    return NextResponse.json({ error: "Solo SUPERADMIN puede cambiar roles." }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(body.role !== undefined && { role: body.role }),
      ...(body.isBanned !== undefined && { isBanned: body.isBanned }),
      ...(body.banReason !== undefined && { banReason: body.banReason }),
    },
    select: { id: true, username: true, role: true, isBanned: true, banReason: true },
  });

  return NextResponse.json({ user });
}
