"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, Layers, Zap, MessageCircle, Settings, LogOut, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cuentas", label: "Cuentas", icon: Package },
  { href: "/admin/skins", label: "Skins", icon: Layers },
  { href: "/admin/boost", label: "Boost Chats", icon: Zap },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export function AdminSidebar({ role, username }: { role: string; username: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-bg2 border-r border-[#1e2330] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-[#1e2330]">
        <div className="flex items-center gap-2 mb-1">
          <svg viewBox="0 0 30 30" className="w-7 h-7">
            <polygon points="15,2 28,9 28,21 15,28 2,21 2,9" fill="#f5700a" />
            <text x="15" y="19" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="10">531</text>
          </svg>
          <span className="font-rajdhani font-bold text-white text-base">531 <span className="text-orange">Admin</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#5a6475] mt-1">
          <Shield size={10} className="text-orange" />
          <span className="text-orange font-semibold uppercase tracking-widest">{role}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-barlow font-medium transition-all ${
                active
                  ? "bg-orange/10 border border-orange/25 text-orange"
                  : "text-[#8a95a3] hover:text-white hover:bg-bg3 border border-transparent"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1e2330]">
        <div className="text-xs text-[#5a6475] px-3 py-2 truncate">{username}</div>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-[#5a6475] hover:text-white transition-colors">
          <Settings size={13} />
          Ver sitio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#5a6475] hover:text-red-400 transition-colors"
        >
          <LogOut size={13} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
