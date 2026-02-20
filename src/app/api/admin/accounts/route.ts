import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(session: any) {
  return session && ["ADMIN", "SUPERADMIN"].includes((session.user as any)?.role);
}

// POST - Create account
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Sin permisos." }, { status: 403 });

  const body = await req.json();
  const userId = (session!.user as any).id;

  const account = await prisma.account.create({
    data: {
      title: body.title,
      rank: body.rank,
      hours: body.hours,
      year: body.year,
      prime: body.prime ?? true,
      faceitLevel: body.faceitLevel || null,
      esea: body.esea || null,
      price: body.price,
      originalPrice: body.originalPrice || null,
      description: body.description || null,
      credentials: body.credentials || null,
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      sellerId: userId,
    },
    include: { seller: { select: { username: true } } },
  });

  return NextResponse.json({ account });
}
