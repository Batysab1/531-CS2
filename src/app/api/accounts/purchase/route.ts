import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    const { accountId } = await req.json();
    const userId = (session.user as any).id;

    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account || !account.isAvailable) {
      return NextResponse.json({ error: "Esta cuenta no está disponible." }, { status: 400 });
    }

    // Create order and mark account as sold
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          accountId,
          total: account.price,
          status: "COMPLETED",
        },
      }),
      prisma.account.update({
        where: { id: accountId },
        data: { isAvailable: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      credentials: account.credentials || "Las credenciales serán enviadas por el vendedor vía Discord en los próximos minutos.",
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: "Error al procesar la compra." }, { status: 500 });
  }
}
