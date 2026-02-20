import { Header } from "@/components/Header";
import Link from "next/link";

export default function DiscordPage() {
  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/531accounts";

  return (
    <div>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Discord logo */}
          <div className="w-24 h-24 mx-auto mb-6 bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#5865F2]">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.134 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>

          <h1 className="font-rajdhani font-bold text-white text-4xl mb-3">
            Únete a nuestro <span className="text-[#5865F2]">Discord</span>
          </h1>
          <p className="text-[#8a95a3] text-lg mb-8 leading-relaxed">
            Nuestro servidor de Discord es el lugar donde ocurre todo: soporte, compras, boost y más. Más de <span className="text-white font-semibold">5,000 miembros</span> activos.
          </p>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-rajdhani font-bold text-xl uppercase tracking-widest transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.134 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Unirse al Discord
          </a>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { icon: "🎫", title: "Tickets de Soporte", desc: "Abre un ticket para recibir ayuda con compras, boost y más." },
              { icon: "💬", title: "Comunidad Activa", desc: "Conecta con otros jugadores, comparte clips y trades." },
              { icon: "🔔", title: "Alertas de Ofertas", desc: "Recibe notificaciones cuando aparezcan cuentas nuevas." },
            ].map((f) => (
              <div key={f.title} className="card-base p-5 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-rajdhani font-bold text-white text-base mb-1">{f.title}</div>
                <div className="text-xs text-[#5a6475] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* How to open ticket */}
          <div className="mt-8 card-base p-6 text-left">
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">¿Cómo abrir un ticket?</h3>
            <ol className="flex flex-col gap-2">
              {[
                "Entra al servidor de Discord con el botón de arriba.",
                "Ve al canal #abrir-ticket.",
                'Haz clic en el botón "Crear Ticket".',
                "Describe tu problema o consulta.",
                "Un admin te atenderá en menos de 5 minutos.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#8a95a3]">
                  <span className="font-rajdhani font-bold text-orange text-base shrink-0 leading-none mt-0.5">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
