"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield, LogOut, User, ChevronDown } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPERADMIN";

  return (
    <>
      {/* Ticker */}
      <div className="bg-orange py-2 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-ticker">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-12">
              <span className="font-rajdhani font-bold text-black text-xs uppercase tracking-widest flex items-center gap-2">⚡ Cuentas Prime desde $14.99 <span className="opacity-40">|</span></span>
              <span className="font-rajdhani font-bold text-black text-xs uppercase tracking-widest flex items-center gap-2">🏆 Global Elite disponibles <span className="opacity-40">|</span></span>
              <span className="font-rajdhani font-bold text-black text-xs uppercase tracking-widest flex items-center gap-2">🛡️ Pagos seguros con escrow <span className="opacity-40">|</span></span>
              <span className="font-rajdhani font-bold text-black text-xs uppercase tracking-widest flex items-center gap-2">💬 Soporte 24/7 en Discord <span className="opacity-40">|</span></span>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-bg/95 border-b border-[#1e2330] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10">
              {/* Hexagon logo shape */}
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="#f5700a" />
                <text x="20" y="26" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="14">531</text>
              </svg>
            </div>
            <span className="font-rajdhani text-2xl font-bold text-white">
              531 <span className="text-orange">Accounts</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {[
              { href: "/", label: "Inicio" },
              { href: "/cuentas", label: "Cuentas" },
              { href: "/skins", label: "Skins" },
              { href: "/boost", label: "Boost" },
              { href: "/discord", label: "Discord" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-barlow text-sm font-medium uppercase tracking-widest text-[#8a95a3] hover:text-white px-4 py-2 border border-transparent hover:border-[#1e2330] transition-all"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="font-barlow text-sm font-medium uppercase tracking-widest text-orange border border-orange/30 bg-orange/5 hover:bg-orange/10 px-4 py-2 transition-all flex items-center gap-1.5"
              >
                <Shield size={13} />
                Admin
              </Link>
            )}
          </nav>

          {/* Right: online + auth */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <OnlineCounter />
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 btn-ghost text-xs px-3 py-1.5"
                >
                  <User size={14} />
                  <span>{session.user?.name}</span>
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-bg2 border border-[#1e2330] shadow-xl z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-[#8a95a3] hover:text-white hover:bg-bg3 transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <User size={13} /> Mi Cuenta
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-orange hover:bg-bg3 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Shield size={13} /> Panel Admin
                      </Link>
                    )}
                    <div className="border-t border-[#1e2330]" />
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#8a95a3] hover:text-red-400 hover:bg-bg3 transition-colors"
                    >
                      <LogOut size={13} /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="btn-ghost text-xs px-4 py-2">Iniciar Sesión</Link>
                <Link href="/register" className="btn-primary text-xs px-4 py-2">Registrarse</Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <button className="md:hidden ml-auto text-[#8a95a3]" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-bg2 border-t border-[#1e2330] px-6 py-4 flex flex-col gap-2">
            {["/", "/cuentas", "/skins", "/boost", "/discord"].map((href, i) => (
              <Link key={i} href={href} className="font-barlow uppercase tracking-widest text-[#8a95a3] py-2 text-sm hover:text-white" onClick={() => setMobileOpen(false)}>
                {["Inicio", "Cuentas", "Skins", "Boost", "Discord"][i]}
              </Link>
            ))}
            {!session ? (
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#1e2330]">
                <Link href="/login" className="btn-ghost flex-1 text-center text-xs">Login</Link>
                <Link href="/register" className="btn-primary flex-1 text-center text-xs">Registro</Link>
              </div>
            ) : (
              <button onClick={() => signOut()} className="mt-3 pt-3 border-t border-[#1e2330] text-red-400 text-sm text-left">Cerrar Sesión</button>
            )}
          </div>
        )}
      </header>
    </>
  );
}

function OnlineCounter() {
  // In production this would be a real-time count from Pusher presence channels
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#5a6475]">
      <span className="live-dot" />
      <span id="online-count">247</span> online
    </span>
  );
}
