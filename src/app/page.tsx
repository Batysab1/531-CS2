import { Header } from "@/components/Header";
import { AccountCard } from "@/components/AccountCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, Zap, Star, MessageCircle, ChevronRight } from "lucide-react";

async function getFeaturedAccounts() {
  try {
    return await prisma.account.findMany({
      where: { isAvailable: true },
      include: { seller: { select: { username: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch { return []; }
}

async function getStats() {
  try {
    const [accounts, users] = await Promise.all([
      prisma.account.count({ where: { isAvailable: true } }),
      prisma.user.count(),
    ]);
    return { accounts, users };
  } catch { return { accounts: 0, users: 0 }; }
}

export default async function HomePage() {
  const [accounts, stats] = await Promise.all([getFeaturedAccounts(), getStats()]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative bg-bg2 border-b border-[#1e2330] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(245,112,10,0.08)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "linear-gradient(#1e2330 1px, transparent 1px), linear-gradient(90deg, #1e2330 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeUp">
            {/* Logo big */}
            <div className="flex items-center gap-4 mb-8">
              <svg viewBox="0 0 60 60" className="w-16 h-16">
                <polygon points="30,3 57,17 57,43 30,57 3,43 3,17" fill="#f5700a" />
                <text x="30" y="38" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="20">531</text>
              </svg>
              <div>
                <h2 className="font-rajdhani font-bold text-white text-3xl leading-none">531 Accounts</h2>
                <p className="text-[#5a6475] text-sm uppercase tracking-widest">Marketplace CS2</p>
              </div>
            </div>

            <h1 className="font-rajdhani font-bold text-white leading-none mb-4" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
              El Mercado #1 de<br />Cuentas de <span className="text-orange">CS2</span>
            </h1>
            <p className="text-[#8a95a3] text-lg mb-8 max-w-lg leading-relaxed">
              Compra y vende cuentas de Counter-Strike 2 de forma segura. Pagos protegidos con escrow, vendedores verificados y garantía de satisfacción.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/cuentas" className="btn-primary text-sm px-7 py-3">Ver Cuentas</Link>
              <Link href="/boost" className="btn-outline text-sm px-7 py-3">Boost de Rank</Link>
              <Link href="/discord" className="btn-ghost text-sm px-7 py-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.134 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Discord
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mt-10 border border-[#1e2330]">
              {[
                { num: stats.accounts || "0", label: "Cuentas Activas" },
                { num: stats.users || "0", label: "Usuarios" },
                { num: "98%", label: "Satisfacción" },
              ].map((s, i) => (
                <div key={i} className="bg-bg3 py-4 text-center border-r last:border-r-0 border-[#1e2330]">
                  <div className="font-rajdhani font-bold text-2xl text-white">{s.num}<span className="text-orange">+</span></div>
                  <div className="text-[10px] text-[#5a6475] uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured cards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-[#5a6475] text-xs uppercase tracking-widest mb-2 font-barlow">
              <span>Destacados ahora</span>
              <div className="flex-1 h-px bg-[#1e2330]" />
              <span className="live-dot" />
            </div>
            {accounts.slice(0, 4).map((acc) => (
              <Link key={acc.id} href={`/cuentas/${acc.id}`}
                className="card-base flex items-center gap-3 p-3 hover:border-orange/40 transition-all group">
                <div className="w-10 h-10 flex items-center justify-center font-rajdhani font-bold text-[11px] text-orange bg-orange/10 border border-orange/20 shrink-0 uppercase">
                  {acc.rank.split(" ").map(w => w[0]).slice(-2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-rajdhani font-bold text-white text-sm truncate">{acc.title}</div>
                  <div className="text-xs text-[#5a6475] font-mono">{acc.hours.toLocaleString()}h · {acc.year} {acc.prime ? "· Prime" : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-rajdhani font-bold text-orange text-lg leading-none">${acc.price}</div>
                  <ChevronRight size={14} className="text-[#5a6475] ml-auto mt-0.5 group-hover:text-orange transition-colors" />
                </div>
              </Link>
            ))}
            {accounts.length === 0 && (
              <div className="card-base p-8 text-center text-[#5a6475] text-sm">
                Próximamente — sé el primero en publicar una cuenta
              </div>
            )}
            <Link href="/cuentas" className="btn-ghost text-center text-xs py-2 mt-1">
              Ver todas las cuentas →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ACCOUNTS GRID */}
      {accounts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Cuentas <span className="text-orange">Disponibles</span></h2>
            <Link href="/cuentas" className="btn-ghost text-xs px-4 py-2">Ver todo →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                id={acc.id}
                title={acc.title}
                rank={acc.rank}
                hours={acc.hours}
                year={acc.year}
                prime={acc.prime}
                faceitLevel={acc.faceitLevel}
                price={acc.price}
                originalPrice={acc.originalPrice}
                isFeatured={acc.isFeatured}
                seller={acc.seller}
              />
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="bg-bg2 border-y border-[#1e2330] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title mb-2">Cómo <span className="text-orange">Funciona</span></h2>
          <p className="text-[#5a6475] mb-10 text-base">Proceso simple, seguro y rápido en 4 pasos</p>
          <div className="grid md:grid-cols-4 gap-px bg-[#1e2330]">
            {[
              { num: "01", icon: "🔍", title: "Busca tu cuenta", desc: "Filtra por rank, precio, horas de juego y más." },
              { num: "02", icon: "💳", title: "Pago seguro", desc: "Tu pago queda protegido en nuestro sistema de escrow." },
              { num: "03", icon: "🔑", title: "Recibe tu cuenta", desc: "El vendedor te entrega las credenciales verificadas." },
              { num: "04", icon: "✅", title: "Cambia los datos", desc: "Cambia email y contraseña. Garantía de 48 horas." },
            ].map((step) => (
              <div key={step.num} className="bg-bg2 p-7 relative overflow-hidden">
                <span className="absolute top-2 right-4 font-rajdhani font-bold text-7xl text-orange/5 leading-none select-none">{step.num}</span>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-rajdhani font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-[#5a6475] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-px bg-[#1e2330] border border-[#1e2330]">
          {[
            { icon: <Shield size={22} className="text-orange" />, title: "Pago con Escrow", desc: "Tu dinero protegido hasta confirmar la recepción de la cuenta." },
            { icon: <Star size={22} className="text-orange" />, title: "Vendedores Verificados", desc: "Todos los vendedores pasan verificación de identidad y reputación." },
            { icon: <Zap size={22} className="text-orange" />, title: "Garantía 48h", desc: "Si algo no está bien, tienes 48h para abrir una disputa y recibir reembolso." },
            { icon: <MessageCircle size={22} className="text-orange" />, title: "Soporte 24/7", desc: "Nuestro equipo en Discord disponible todos los días del año." },
          ].map((t, i) => (
            <div key={i} className="bg-bg2 p-7 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-orange/10 border border-orange/20 flex items-center justify-center">{t.icon}</div>
              <h3 className="font-rajdhani font-bold text-white text-lg mb-2">{t.title}</h3>
              <p className="text-[#5a6475] text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060708] border-t border-[#1e2330] pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 40 40" className="w-8 h-8"><polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="#f5700a" /><text x="20" y="26" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="14">531</text></svg>
              <span className="font-rajdhani font-bold text-white text-xl">531 <span className="text-orange">Accounts</span></span>
            </div>
            <p className="text-[#5a6475] text-sm leading-relaxed mb-4">El mercado más seguro y confiable para comprar y vender cuentas de CS2.</p>
          </div>
          {[
            { title: "Comprar", links: [["Cuentas CS2", "/cuentas"], ["Skins & Items", "/skins"], ["Boost de Rank", "/boost"]] },
            { title: "Plataforma", links: [["Discord", "/discord"], ["Cómo Funciona", "#"], ["Términos de Uso", "#"]] },
            { title: "Soporte", links: [["Abrir Ticket", "/discord"], ["Centro de Ayuda", "#"], ["Disputas", "#"]] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-rajdhani font-bold text-xs uppercase tracking-widest text-[#8a95a3] mb-4 pb-2 border-b border-[#1e2330]">{col.title}</div>
              <div className="flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} className="text-[#5a6475] text-sm hover:text-orange transition-colors">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-[#1e2330] flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#5a6475]">
          <span>© 2025 531 Accounts. No afiliado con Valve Corporation.</span>
          <span className="flex gap-4">💳 Visa / MC · ₿ Crypto · 💸 PayPal</span>
        </div>
      </footer>
    </div>
  );
}
