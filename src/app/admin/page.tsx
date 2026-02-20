import { prisma } from "@/lib/prisma";
import { Package, Users, ShoppingBag, MessageCircle } from "lucide-react";

async function getStats() {
  const [accounts, users, orders, chats] = await Promise.all([
    prisma.account.count({ where: { isAvailable: true } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.boostChat.count({ where: { status: { not: "CLOSED" } } }),
  ]).catch(() => [0, 0, 0, 0]);
  return { accounts, users, orders, chats };
}

async function getRecentOrders() {
  return prisma.order.findMany({
    include: {
      user: { select: { username: true } },
      account: { select: { title: true, rank: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  }).catch(() => []);
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()]);

  return (
    <div>
      <h1 className="font-rajdhani font-bold text-white text-3xl mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cuentas activas", value: stats.accounts, icon: Package, color: "text-orange" },
          { label: "Usuarios", value: stats.users, icon: Users, color: "text-blue-400" },
          { label: "Órdenes totales", value: stats.orders, icon: ShoppingBag, color: "text-green-400" },
          { label: "Chats boost abiertos", value: stats.chats, icon: MessageCircle, color: "text-purple-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-base p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#5a6475] uppercase tracking-widest font-barlow">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className={`font-rajdhani font-bold text-3xl ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card-base">
        <div className="p-4 border-b border-[#1e2330]">
          <h2 className="font-rajdhani font-bold text-white text-lg">Órdenes Recientes</h2>
        </div>
        <div className="divide-y divide-[#1e2330]">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-[#5a6475] text-sm">No hay órdenes aún.</div>
          ) : recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-bg3 transition-colors">
              <div className="flex-1">
                <div className="text-sm text-white font-semibold">{order.account?.title || "Servicio"}</div>
                <div className="text-xs text-[#5a6475]">por {order.user.username}</div>
              </div>
              <div className="text-orange font-rajdhani font-bold">${order.total.toFixed(2)}</div>
              <span className={`badge text-xs ${
                order.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                order.status === "PENDING" ? "bg-orange/10 text-orange border-orange/30" :
                "bg-red-500/10 text-red-400 border-red-500/30"
              }`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
