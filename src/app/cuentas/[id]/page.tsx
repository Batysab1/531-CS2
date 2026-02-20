import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, getRankColor } from "@/lib/utils";
import { BuyAccountButton } from "./BuyAccountButton";
import { Shield, Clock, Star, Copy } from "lucide-react";

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const account = await prisma.account.findUnique({
    where: { id: params.id },
    include: { seller: { select: { username: true, createdAt: true } } },
  }).catch(() => null);

  if (!account) notFound();

  const rankColor = getRankColor(account.rank);

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Info */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="card-base p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="badge text-sm" style={{ color: rankColor, borderColor: rankColor, background: `${rankColor}15` }}>
                  {account.rank}
                </span>
                {account.prime && (
                  <span className="badge bg-[#2ebd85]/10 text-[#2ebd85] border-[#2ebd85]/30">Prime Status</span>
                )}
              </div>
              <h1 className="font-rajdhani font-bold text-white text-3xl mb-2">{account.title}</h1>
              {account.description && (
                <p className="text-[#8a95a3] text-sm leading-relaxed">{account.description}</p>
              )}
            </div>

            {/* Specs */}
            <div className="card-base p-6">
              <h2 className="font-rajdhani font-bold text-white text-lg mb-4 uppercase tracking-wide">Especificaciones</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Rank", value: account.rank },
                  { label: "Horas de juego", value: `${account.hours.toLocaleString()}h` },
                  { label: "Año de creación", value: account.year.toString() },
                  { label: "Prime Status", value: account.prime ? "Sí ✓" : "No" },
                  { label: "Nivel Faceit", value: account.faceitLevel ? `Nivel ${account.faceitLevel}` : "N/A" },
                  { label: "ESEA", value: account.esea || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-bg3 border border-[#1e2330] p-3">
                    <div className="text-xs text-[#5a6475] uppercase tracking-widest font-barlow mb-1">{label}</div>
                    <div className="font-mono text-sm text-[#cdd6e0]">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller */}
            <div className="card-base p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange/10 border border-orange/20 flex items-center justify-center font-rajdhani font-bold text-orange text-sm">
                {account.seller.username[0].toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-white font-semibold">{account.seller.username}</div>
                <div className="text-xs text-[#5a6475]">Vendedor verificado · <span className="text-yellow-400">★★★★★</span></div>
              </div>
            </div>
          </div>

          {/* Right: Buy */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="card-base p-6 sticky top-20">
              <div className="mb-4">
                {account.originalPrice && account.originalPrice > account.price && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#5a6475] line-through text-sm">{formatPrice(account.originalPrice)}</span>
                    <span className="badge bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                      -{Math.round((1 - account.price / account.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <div className="font-rajdhani font-bold text-orange text-4xl">{formatPrice(account.price)}</div>
              </div>

              <BuyAccountButton accountId={account.id} price={account.price} title={account.title} />

              {/* Discord ticket */}
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/531accounts"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full text-center flex items-center justify-center gap-2 mt-3 text-sm py-2.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#5865F2]">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.134 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Abrir Ticket en Discord
              </a>

              <div className="mt-4 flex flex-col gap-2">
                {[
                  { icon: <Shield size={13} />, text: "Pago protegido con escrow" },
                  { icon: <Clock size={13} />, text: "Garantía de 48 horas" },
                  { icon: <Star size={13} />, text: "Vendedor verificado" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-[#5a6475]">
                    <span className="text-orange">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
