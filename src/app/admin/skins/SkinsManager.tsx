"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Loader2, X, Check } from "lucide-react";

const WEARS = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
const WEAPONS = ["AK-47", "M4A4", "M4A1-S", "AWP", "Desert Eagle", "USP-S", "Glock-18", "Karambit", "Butterfly Knife", "Bayonet", "Falchion Knife", "M9 Bayonet", "Flip Knife", "Shadow Daggers", "Bowie Knife", "Kukri Knife", "Paracord Knife", "Gut Knife", "Ursus Knife", "Talon Knife", "Navaja Knife", "Stiletto Knife", "Skeleton Knife", "Nomad Knife", "Classic Knife", "Huntsman Knife"];

const BLANK_SKIN = {
  name: "", weapon: "AK-47", wear: "Field-Tested", float: 0.25,
  price: 9.99, originalPrice: 0, stickers: "", isStatTrak: false,
  isSouvenir: false, isAvailable: true, isFeatured: false,
};

interface Skin {
  id: string;
  name: string;
  weapon: string;
  wear: string;
  float: number | null;
  price: number;
  originalPrice: number | null;
  stickers: string | null;
  isStatTrak: boolean;
  isSouvenir: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
}

export function SkinsManager({ skins: initial }: { skins: Skin[] }) {
  const [skins, setSkins] = useState<Skin[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Skin | null>(null);
  const [form, setForm] = useState<typeof BLANK_SKIN>(BLANK_SKIN);
  const [loading, setLoading] = useState(false);

  function openNew() { setForm(BLANK_SKIN); setEditing(null); setShowModal(true); }
  function openEdit(s: Skin) {
    setForm({
      name: s.name, weapon: s.weapon, wear: s.wear, float: s.float ?? 0.25,
      price: s.price, originalPrice: s.originalPrice ?? 0, stickers: s.stickers ?? "",
      isStatTrak: s.isStatTrak, isSouvenir: s.isSouvenir,
      isAvailable: s.isAvailable, isFeatured: s.isFeatured,
    });
    setEditing(s);
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    const payload = { ...form, float: form.float || null, originalPrice: form.originalPrice || null, stickers: form.stickers || null };
    const res = await fetch(editing ? `/api/admin/skins/${editing.id}` : "/api/admin/skins", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      if (editing) setSkins((p) => p.map((s) => s.id === data.skin.id ? { ...s, ...data.skin } : s));
      else setSkins((p) => [data.skin, ...p]);
      setShowModal(false);
    } else alert(data.error || "Error.");
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta skin?")) return;
    const res = await fetch(`/api/admin/skins/${id}`, { method: "DELETE" });
    if (res.ok) setSkins((p) => p.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-rajdhani font-bold text-white text-3xl">Gestión de Skins</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={15} /> Nueva Skin
        </button>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg3 border-b border-[#1e2330]">
            <tr>
              {["Skin", "Desgaste", "Float", "Precio", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[#5a6475] text-xs uppercase tracking-widest font-barlow font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2330]">
            {skins.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-[#5a6475]">No hay skins. Añade una.</td></tr>
            )}
            {skins.map((s) => (
              <tr key={s.id} className="hover:bg-bg3 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{s.weapon} | {s.name}</div>
                  <div className="text-xs text-[#5a6475] flex gap-1.5 mt-0.5">
                    {s.isStatTrak && <span className="text-orange">StatTrak™</span>}
                    {s.isSouvenir && <span className="text-yellow-400">Souvenir</span>}
                    {s.stickers && <span>Stickers: {s.stickers}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#8a95a3]">{s.wear}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#5a6475]">{s.float?.toFixed(4) ?? "N/A"}</td>
                <td className="px-4 py-3">
                  <span className="font-rajdhani font-bold text-orange">${s.price}</span>
                  {s.originalPrice && <span className="text-xs text-[#5a6475] line-through ml-1">${s.originalPrice}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${s.isAvailable ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                    {s.isAvailable ? "Disponible" : "Vendida"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(s)} className="text-[#5a6475] hover:text-white"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-[#5a6475] hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg2 border border-[#1e2330] w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#1e2330] flex items-center justify-between">
              <h2 className="font-rajdhani font-bold text-white text-xl">{editing ? "Editar Skin" : "Nueva Skin"}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#5a6475] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Nombre de la skin</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field text-sm" placeholder="Asiimov" />
              </div>
              <div>
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Arma</label>
                <select value={form.weapon} onChange={(e) => setForm((p) => ({ ...p, weapon: e.target.value }))} className="input-field text-sm">
                  {WEAPONS.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Desgaste</label>
                <select value={form.wear} onChange={(e) => setForm((p) => ({ ...p, wear: e.target.value }))} className="input-field text-sm">
                  {WEARS.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Float</label>
                <input type="number" step="0.0001" min="0" max="1" value={form.float} onChange={(e) => setForm((p) => ({ ...p, float: Number(e.target.value) }))} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Precio ($)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Precio Original ($)</label>
                <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} className="input-field text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-[#5a6475] uppercase tracking-widest mb-1 font-barlow">Stickers</label>
                <input value={form.stickers} onChange={(e) => setForm((p) => ({ ...p, stickers: e.target.value }))} className="input-field text-sm" placeholder="Virtus.pro | Titan | ESL..." />
              </div>
              <div className="col-span-2 flex gap-6 flex-wrap">
                {[
                  { key: "isStatTrak", label: "StatTrak™" },
                  { key: "isSouvenir", label: "Souvenir" },
                  { key: "isAvailable", label: "Disponible" },
                  { key: "isFeatured", label: "Destacada" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} className="accent-orange w-4 h-4" />
                    <span className="text-sm text-[#8a95a3]">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-[#1e2330] flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-sm px-5 py-2">Cancelar</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editing ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
