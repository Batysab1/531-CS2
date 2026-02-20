import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(session: any) {
  return session && ["ADMIN", "SUPERADMIN"].includes((session.user as any)?.role);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });

  const body = await req.json();
  const account = await prisma.account.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.rank !== undefined && { rank: body.rank }),
      ...(body.hours !== undefined && { hours: body.hours }),
      ...(body.year !== undefined && { year: body.year }),
      ...(body.prime !== undefined && { prime: body.prime }),
      ...(body.faceitLevel !== undefined && { faceitLevel: body.faceitLevel }),
      ...(body.esea !== undefined && { esea: body.esea }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.credentials !== undefined && { credentials: body.credentials }),
      ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
      ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
    },
    include: { seller: { select: { username: true } } },
  });

  return NextResponse.json({ account });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });

  await prisma.account.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
