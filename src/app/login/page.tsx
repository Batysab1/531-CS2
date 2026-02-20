"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error.includes("BANNED:")) {
        setError("Tu cuenta ha sido suspendida: " + res.error.replace("BANNED:", ""));
      } else {
        setError("Email o contraseña incorrectos.");
      }
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(245,112,10,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <svg viewBox="0 0 60 60" className="w-14 h-14">
              <polygon points="30,3 57,17 57,43 30,57 3,43 3,17" fill="#f5700a" />
              <text x="30" y="38" textAnchor="middle" fill="white" fontFamily="Rajdhani" fontWeight="700" fontSize="20">531</text>
            </svg>
            <span className="font-rajdhani font-bold text-white text-2xl">531 <span className="text-orange">Accounts</span></span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-bg2 border border-[#1e2330]">
          <div className="p-6 border-b border-[#1e2330]">
            <h1 className="font-rajdhani font-bold text-white text-2xl">Iniciar Sesión</h1>
            <p className="text-[#5a6475] text-sm mt-1">Accede a tu cuenta de 531 Accounts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a95a3] mb-2 font-barlow">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6475] hover:text-white"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <p className="text-center text-[#5a6475] text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-orange hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </form>
        </div>

        {/* Discord */}
        <div className="mt-4 card-base p-4 flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5865F2] fill-current shrink-0">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.134 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          <div className="text-xs text-[#5a6475]">
            ¿Problemas para acceder? Contacta en{" "}
            <Link href="/discord" className="text-[#5865F2] hover:underline">nuestro Discord</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
