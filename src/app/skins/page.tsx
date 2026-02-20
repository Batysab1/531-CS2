import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

async function getSkins() {
  try {
    return await prisma.skin.findMany({
      where: { isAvailable: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch { return []; }
}

export default async function SkinsPage() {
  const skins = await getSkins();

  const WEAR_COLORS: Record<string, string> = {
    "Factory New": "#2ebd85",
    "Minimal Wear": "#3b82f6",
    "Field-Tested": "#f5700a",
    "Well-Worn": "#c9a84c",
    "Battle-Scarred": "#e03434",
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="section-title mb-2">Skins <span className="text-orange">& Items</span></h1>
        <p className="text-[#5a6475] mb-8">Las mejores skins de CS2 al mejor precio</p>

        {skins.length === 0 ? (
          <div className="card-base p-16 text-center">
            <div className="text-5xl mb-4">🔫</div>
            <h3 className="font-rajdhani font-bold text-white text-xl mb-2">Próximamente</h3>
            <p className="text-[#5a6475]">Estamos añadiendo skins. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {skins.map((skin) => {
              const wearColor = WEAR_COLORS[skin.wear] || "#5a6475";
              return (
                <div key={skin.id} className="card-base flex flex-col hover:border-orange/40 transition-all group">
                  <div className="p-3 border-b border-[#1e2330] flex justify-between items-center">
                    <span className="badge text-[10px]" style={{ color: wearColor, borderColor: wearColor, background: `${wearColor}15` }}>
                      {skin.wear}
                    </span>
                    <div className="flex gap-1">
                      {skin.isStatTrak && <span className="badge bg-orange/10 text-orange border-orange/30 text-[10px]">ST</span>}
                      {skin.isSouvenir && <span className="badge bg-yellow-400/10 text-yellow-400 border-yellow-400/30 text-[10px]">SV</span>}
                    </div>
                  </div>
                  <div className="p-3 flex-1">
                    <div className="text-xs text-[#5a6475] font-barlow uppercase tracking-widest mb-1">{skin.weapon}</div>
                    <div className="font-rajdhani font-bold text-white text-base leading-tight">{skin.name}</div>
                    {skin.float !== null && skin.float !== undefined && (
                      <div className="font-mono text-xs text-[#5a6475] mt-1">Float: {skin.float.toFixed(4)}</div>
                    )}
                    {skin.stickers && (
                      <div className="text-xs text-[#5a6475] mt-1">Stickers: {skin.stickers}</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-[#1e2330] flex justify-between items-center">
                    <div>
                      <div className="font-rajdhani font-bold text-orange text-xl leading-none">{formatPrice(skin.price)}</div>
                      {skin.originalPrice && skin.originalPrice > skin.price && (
                        <div className="text-xs text-[#5a6475] line-through">{formatPrice(skin.originalPrice)}</div>
                      )}
                    </div>
                    <button className="btn-primary text-xs px-3 py-1.5">Comprar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
