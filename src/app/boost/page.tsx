import { Header } from "@/components/Header";
import { BoostChatSection } from "./BoostChatSection";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

const BOOST_SERVICES = [
  { from: "Silver I", to: "Gold Nova I", price: 9.99, hours: 24 },
  { from: "Gold Nova I", to: "Master Guardian", price: 19.99, hours: 48 },
  { from: "Master Guardian", to: "Legendary Eagle", price: 34.99, hours: 72 },
  { from: "Legendary Eagle", to: "Supreme", price: 54.99, hours: 96 },
  { from: "Supreme", to: "Global Elite", price: 89.99, hours: 120 },
];

export default async function BoostPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let userChats: any[] = [];
  if (userId) {
    userChats = await prisma.boostChat.findMany({
      where: { userId },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    }).catch(() => []);
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="section-title mb-2">Boost de <span className="text-orange">Rank</span></h1>
        <p className="text-[#5a6475] mb-8">Sube de rank con nuestros boosters profesionales. Chat en tiempo real.</p>

        {/* Services */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {BOOST_SERVICES.map((s, i) => (
            <div key={i} className="card-base p-4 hover:border-orange/40 transition-all">
              <div className="text-xs text-[#5a6475] uppercase tracking-widest font-barlow mb-2">Boost</div>
              <div className="font-rajdhani font-bold text-white text-sm mb-1">{s.from}</div>
              <div className="text-orange text-xs mb-1">↓</div>
              <div className="font-rajdhani font-bold text-orange text-sm mb-3">{s.to}</div>
              <div className="font-rajdhani font-bold text-2xl text-white">{formatPrice(s.price)}</div>
              <div className="text-xs text-[#5a6475] mb-3">~{s.hours}h estimadas</div>
            </div>
          ))}
        </div>

        {/* Real-time Chat Section */}
        <BoostChatSection session={session} userChats={userChats} />
      </div>
    </div>
  );
}
