"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, CheckCheck, Loader2, ExternalLink } from "lucide-react";

interface Props {
  accountId: string;
  price: number;
  title: string;
}

export function BuyAccountButton({ accountId, price, title }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [credentials, setCredentials] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleBuy() {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/accounts/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPurchased(true);
      setCredentials(data.credentials);
    } else {
      alert(data.error || "Error al procesar la compra.");
    }
  }

  function copyCredentials() {
    if (credentials) {
      navigator.clipboard.writeText(credentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (purchased && credentials) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-[#2ebd85]/10 border border-[#2ebd85]/30 p-4">
          <div className="text-[#2ebd85] text-sm font-semibold mb-2">✓ ¡Compra exitosa!</div>
          <div className="text-xs text-[#5a6475] mb-3">Guarda estos datos y cámbialos inmediatamente.</div>
          <div className="bg-bg border border-[#1e2330] p-3 font-mono text-xs text-[#cdd6e0] whitespace-pre-wrap break-all">
            {credentials}
          </div>
          <button
            onClick={copyCredentials}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-3 text-xs py-2"
          >
            {copied ? <><CheckCheck size={13} /> ¡Copiado!</> : <><Copy size={13} /> Copiar Credenciales</>}
          </button>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_DISCORD_TICKET_URL || "https://discord.gg/531accounts"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full text-center flex items-center justify-center gap-2 text-xs py-2"
        >
          <ExternalLink size={12} />
          Abrir ticket de soporte en Discord
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {loading ? "Procesando..." : session ? "Comprar Ahora" : "Inicia sesión para comprar"}
    </button>
  );
}
