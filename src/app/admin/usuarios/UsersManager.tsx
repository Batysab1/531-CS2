"use client";
import { useState } from "react";
import { Ban, Shield, ShieldOff, Loader2, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  isBanned: boolean;
  banReason: string | null;
  createdAt: string;
  _count: { orders: number };
}

export function UsersManager({ users: initial, currentRole }: { users: User[]; currentRole: string }) {
  const [users, setUsers] = useState<User[]>(initial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [banModal, setBanModal] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function setRole(userId: string, role: string) {
    if (currentRole !== "SUPERADMIN") return alert("Solo SUPERADMIN puede cambiar roles.");
    setLoading(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) setUsers((p) => p.map((u) => u.id === userId ? { ...u, role: data.user.role } : u));
    else alert(data.error || "Error.");
  }

  async function handleBan(user: User) {
    if (user.isBanned) {
      // Unban directly
      setLoading(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: false, banReason: null }),
      });
      setLoading(null);
      if (res.ok) setUsers((p) => p.map((u) => u.id === user.id ? { ...u, isBanned: false, banReason: null } : u));
    } else {
      setBanModal(user);
      setBanReason("");
    }
  }

  async function confirmBan() {
    if (!banModal) return;
    setLoading(banModal.id);
    const res = await fetch(`/api/admin/users/${banModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: true, banReason: banReason || "Violación de términos." }),
    });
    setLoading(null);
    if (res.ok) {
      setUsers((p) => p.map((u) => u.id === banModal.id ? { ...u, isBanned: true, banReason } : u));
      setBanModal(null);
    }
  }

  const ROLE_COLORS: Record<string, string> = {
    SUPERADMIN: "text-red-400 border-red-400/30 bg-red-400/10",
    ADMIN: "text-orange border-orange/30 bg-orange/10",
    USER: "text-[#5a6475] border-[#5a6475]/30 bg-[#5a6475]/5",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-rajdhani font-bold text-white text-3xl">Gestión de Usuarios</h1>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6475]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-8 text-sm w-60 py-2" placeholder="Buscar usuario..." />
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg3 border-b border-[#1e2330]">
            <tr>
              {["Usuario", "Email", "Rol", "Órdenes", "Registrado", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[#5a6475] text-xs uppercase tracking-widest font-barlow font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2330]">
            {filtered.map((user) => (
              <tr key={user.id} className={`hover:bg-bg3 transition-colors ${user.isBanned ? "opacity-50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{user.username}</div>
                </td>
                <td className="px-4 py-3 text-xs text-[#5a6475] font-mono">{user.email}</td>
                <td className="px-4 py-3">
                  {currentRole === "SUPERADMIN" ? (
                    <select
                      value={user.role}
                      onChange={(e) => setRole(user.id, e.target.value)}
                      className={`badge cursor-pointer text-xs ${ROLE_COLORS[user.role]} bg-transparent border`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  ) : (
                    <span className={`badge text-xs ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#5a6475]">{user._count.orders}</td>
                <td className="px-4 py-3 text-xs text-[#5a6475]">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: es })}
                </td>
                <td className="px-4 py-3">
                  {user.isBanned ? (
                    <span className="badge bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                      Baneado
                    </span>
                  ) : (
                    <span className="badge bg-green-500/10 text-green-400 border-green-500/30 text-xs">Activo</span>
                  )}
                  {user.banReason && <div className="text-[10px] text-[#5a6475] mt-0.5">{user.banReason}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBan(user)}
                      disabled={loading === user.id}
                      title={user.isBanned ? "Desbanear" : "Banear"}
                      className={`transition-colors ${user.isBanned ? "text-[#2ebd85] hover:text-green-300" : "text-[#5a6475] hover:text-red-400"}`}
                    >
                      {loading === user.id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                    </button>
                    {currentRole === "SUPERADMIN" && user.role === "USER" && (
                      <button onClick={() => setRole(user.id, "ADMIN")} title="Hacer Admin"
                        className="text-[#5a6475] hover:text-orange transition-colors">
                        <Shield size={14} />
                      </button>
                    )}
                    {currentRole === "SUPERADMIN" && user.role === "ADMIN" && (
                      <button onClick={() => setRole(user.id, "USER")} title="Quitar Admin"
                        className="text-orange hover:text-[#5a6475] transition-colors">
                        <ShieldOff size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ban modal */}
      {banModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-bg2 border border-[#1e2330] p-6 w-full max-w-md">
            <h3 className="font-rajdhani font-bold text-white text-xl mb-4">
              Banear a <span className="text-red-400">{banModal.username}</span>
            </h3>
            <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-2 font-barlow">Razón del ban</label>
            <textarea value={banReason} onChange={(e) => setBanReason(e.target.value)}
              className="input-field text-sm h-20 resize-none mb-4" placeholder="Violación de términos, fraude..." />
            <div className="flex gap-3">
              <button onClick={() => setBanModal(null)} className="btn-ghost flex-1 text-sm py-2">Cancelar</button>
              <button onClick={confirmBan} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-barlow font-semibold uppercase tracking-widest text-sm py-2 transition-all border border-red-500">
                Confirmar Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
