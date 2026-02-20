"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al crear la cuenta.");
    } else {
      router.push("/login?registered=1");
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(245,112,10,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <svg viewBox="0 0 60 60" className="w-14 h-14">
              <polygon points="30,3 57,17 57,43 30,57 3,43 3,17" fill="#f5700a" />
              <text x="30" y="38" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="20">531</text>
            </svg>
            <span className="font-rajdhani font-bold text-white text-2xl">531 <span className="text-orange">Accounts</span></span>
          </Link>
        </div>

        <div className="bg-bg2 border border-[#1e2330]">
          <div className="p-6 border-b border-[#1e2330]">
            <h1 className="font-rajdhani font-bold text-white text-2xl">Crear Cuenta</h1>
            <p className="text-[#5a6475] text-sm mt-1">Únete a la comunidad de 531 Accounts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />{error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">Nombre de usuario</label>
              <input type="text" value={form.username} onChange={(e) => update("username", e.target.value)}
                className="input-field" placeholder="GamerPro99" required minLength={3} maxLength={20} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="input-field" placeholder="tu@email.com" required />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">Contraseña</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="input-field pr-10" placeholder="Mínimo 8 caracteres" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6475] hover:text-white">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3].map((l) => (
                    <div key={l} className="h-1 flex-1 transition-colors"
                      style={{ background: strength >= l ? (strength === 1 ? "#e03434" : strength === 2 ? "#f5700a" : "#2ebd85") : "#1e2330" }} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">Confirmar contraseña</label>
              <div className="relative">
                <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)}
                  className="input-field pr-8" placeholder="Repite tu contraseña" required />
                {form.confirm && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.confirm === form.password
                      ? <CheckCircle2 size={15} className="text-[#2ebd85]" />
                      : <AlertCircle size={15} className="text-red-400" />}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#5a6475]">
              Al registrarte aceptas nuestros{" "}
              <Link href="#" className="text-orange hover:underline">Términos de Uso</Link> y{" "}
              <Link href="#" className="text-orange hover:underline">Política de Privacidad</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-1">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Creando cuenta..." : "Crear Cuenta Gratis"}
            </button>

            <p className="text-center text-[#5a6475] text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-orange hover:underline">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
