"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2, X, Check } from "lucide-react";
import { RANKS } from "@/lib/utils";

interface Account {
  id: string;
  title: string;
  rank: string;
  hours: number;
  year: number;
  prime: boolean;
  faceitLevel: number | null;
  esea: string | null;
  price: number;
  originalPrice: number | null;
  description: string | null;
  credentials: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  seller: { username: string };
}

const BLANK = {
  title: "", rank: "Gold Nova I", hours: 500, year: 2020,
  prime: true, faceitLevel: 0, esea: "", price: 19.99,
  originalPrice: 0, description: "", credentials: "", isAvailable: true, isFeatured: false,
};

export function AccountsManager({ accounts: initial, userId }: { accounts: Account[]; userId: string }) {
  const [accounts, setAccounts] = useState<Account[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<typeof BLANK>(BLANK);
  const [loading, setLoading] = useState(false);
  const [showCreds, setShowCreds] = useState<Record<string, boolean>>({});

  function openNew() { setForm(BLANK); setEditing(null); setShowModal(true); }
  function openEdit(acc: Account) {
    setForm({
      title: acc.title, rank: acc.rank, hours: acc.hours, year: acc.year,
      prime: acc.prime, faceitLevel: acc.faceitLevel || 0, esea: acc.esea || "",
      price: acc.price, originalPrice: acc.originalPrice || 0,
      description: acc.description || "", credentials: acc.credentials || "",
      isAvailable: acc.isAvailable, isFeatured: acc.isFeatured,
    });
    setEditing(acc);
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    const payload = {
      ...form,
      faceitLevel: form.faceitLevel || null,
      originalPrice: form.originalPrice || null,
      esea: form.esea || null,
      description: form.description || null,
      credentials: form.credentials || null,
    };

    const res = await fetch(editing ? `/api/admin/accounts/${editing.id}` : "/api/admin/accounts", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      if (editing) {
        setAccounts((prev) => prev.map((a) => (a.id === data.account.id ? { ...a, ...data.account } : a)));
      } else {
        setAccounts((prev) => [data.account, ...prev]);
      }
      setShowModal(false);
    } else {
      alert(data.error || "Error al guardar.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta cuenta?")) return;
    const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
    if (res.ok) setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  async function toggleFeatured(acc: Account) {
    const res = await fetch(`/api/admin/accounts/${acc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !acc.isFeatured }),
    });
    const data = await res.json();
    if (res.ok) setAccounts((prev) => prev.map((a) => (a.id === acc.id ? { ...a, isFeatured: !a.isFeatured } : a)));
  }

  async function toggleAvailable(acc: Account) {
    const res = await fetch(`/api/admin/accounts/${acc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !acc.isAvailable }),
    });
    if (res.ok) setAccounts((prev) => prev.map((a) => (a.id === acc.id ? { ...a, isAvailable: !a.isAvailable } : a)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-rajdhani font-bold text-white text-3xl">Gestión de Cuentas</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={15} /> Nueva Cuenta
        </button>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg3 border-b border-[#1e2330]">
              <tr>
                {["Título", "Rank", "Precio", "Estado", "Destacada", "Credenciales", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#5a6475] text-xs uppercase tracking-widest font-barlow font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {accounts.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-[#5a6475]">No hay cuentas. Añade una.</td></tr>
              )}
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-bg3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white text-sm">{acc.title}</div>
                    <div className="text-xs text-[#5a6475]">{acc.hours.toLocaleString()}h · {acc.year} · {acc.seller.username}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8a95a3]">{acc.rank}</td>
                  <td className="px-4 py-3">
                    <span className="font-rajdhani font-bold text-orange">${acc.price}</span>
                    {acc.originalPrice && <span className="text-xs text-[#5a6475] line-through ml-1">${acc.originalPrice}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailable(acc)}
                      className={`badge text-xs cursor-pointer ${acc.isAvailable ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                      {acc.isAvailable ? "Disponible" : "Vendida"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(acc)}
                      className={`p-1 transition-colors ${acc.isFeatured ? "text-yellow-400" : "text-[#5a6475] hover:text-yellow-400"}`}>
                      <Star size={15} fill={acc.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {acc.credentials ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowCreds((p) => ({ ...p, [acc.id]: !p[acc.id] }))}
                          className="text-[#5a6475] hover:text-white">
                          {showCreds[acc.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        {showCreds[acc.id] && (
                          <span className="font-mono text-xs text-[#8a95a3] max-w-[150px] truncate">{acc.credentials}</span>
                        )}
                      </div>
                    ) : <span className="text-xs text-[#3a4050]">Sin credenciales</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(acc)} className="text-[#5a6475] hover:text-white transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(acc.id)} className="text-[#5a6475] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg2 border border-[#1e2330] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#1e2330] flex items-center justify-between">
              <h2 className="font-rajdhani font-bold text-white text-xl">{editing ? "Editar Cuenta" : "Nueva Cuenta"}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#5a6475] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                { label: "Título", key: "title", type: "text", full: true },
                { label: "Precio ($)", key: "price", type: "number" },
                { label: "Precio Original ($)", key: "originalPrice", type: "number" },
                { label: "Horas", key: "hours", type: "number" },
                { label: "Año de creación", key: "year", type: "number" },
                { label: "Nivel Faceit (0 = ninguno)", key: "faceitLevel", type: "number" },
                { label: "ESEA", key: "esea", type: "text" },
              ].map(({ label, key, type, full }) => (
                <div key={key} className={full ? "col-span-2" : ""}>
                  <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">{label}</label>
                  <input type={type} value={(form as any)[key]} step={type === "number" ? "0.01" : undefined}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="input-field text-sm" />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Rank</label>
                <select value={form.rank} onChange={(e) => setForm((p) => ({ ...p, rank: e.target.value }))} className="input-field text-sm">
                  {RANKS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-field text-sm h-20 resize-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Credenciales (privadas)</label>
                <textarea value={form.credentials} onChange={(e) => setForm((p) => ({ ...p, credentials: e.target.value }))}
                  className="input-field text-sm h-20 resize-none font-mono" placeholder="email:password o instrucciones..." />
              </div>

              <div className="col-span-2 flex gap-6">
                {[
                  { key: "prime", label: "Prime Status" },
                  { key: "isAvailable", label: "Disponible" },
                  { key: "isFeatured", label: "Destacada" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                      className="accent-orange w-4 h-4" />
                    <span className="text-sm text-[#8a95a3]">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-[#1e2330] flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-sm px-5 py-2">Cancelar</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editing ? "Guardar Cambios" : "Crear Cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
