import Link from "next/link";
import { formatPrice, getRankColor } from "@/lib/utils";
import { Star, Clock, Shield } from "lucide-react";

interface AccountCardProps {
  id: string;
  title: string;
  rank: string;
  hours: number;
  year: number;
  prime: boolean;
  faceitLevel?: number | null;
  price: number;
  originalPrice?: number | null;
  isFeatured?: boolean;
  seller?: { username: string };
}

export function AccountCard({ id, title, rank, hours, year, prime, faceitLevel, price, originalPrice, isFeatured, seller }: AccountCardProps) {
  const rankColor = getRankColor(rank);
  const isDiscounted = originalPrice && originalPrice > price;

  return (
    <Link href={`/cuentas/${id}`} className="card-base flex flex-col hover:border-orange/40 hover:-translate-y-0.5 group relative overflow-hidden">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start p-3 pb-0">
        <span
          className="badge text-[10px]"
          style={{ color: rankColor, borderColor: rankColor, background: `${rankColor}15` }}
        >
          {rank.length > 20 ? rank.split(" ").slice(-2).join(" ") : rank}
        </span>
        <div className="flex gap-1">
          {isFeatured && (
            <span className="badge bg-orange/10 text-orange border-orange/30 text-[10px]">TOP</span>
          )}
          {isDiscounted && (
            <span className="badge bg-red-500/10 text-red-400 border-red-500/30 text-[10px]">
              -{Math.round((1 - price / originalPrice!) * 100)}%
            </span>
          )}
          {prime && (
            <span className="badge bg-[#2ebd85]/10 text-[#2ebd85] border-[#2ebd85]/30 text-[10px]">PRIME</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1">
        <h3 className="font-rajdhani font-bold text-white text-base leading-tight mb-2">{title}</h3>
        <div className="flex flex-col gap-1 font-mono text-[11px] text-[#5a6475]">
          <div className="flex justify-between">
            <span>Horas</span>
            <span className="text-[#8a95a3]">{hours.toLocaleString()}h</span>
          </div>
          <div className="flex justify-between">
            <span>Creada</span>
            <span className="text-[#8a95a3]">{year}</span>
          </div>
          {faceitLevel && (
            <div className="flex justify-between">
              <span>Faceit</span>
              <span className="text-[#8a95a3]">Nivel {faceitLevel}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Prime</span>
            <span className={prime ? "text-[#2ebd85]" : "text-[#5a6475]"}>{prime ? "Sí" : "No"}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#1e2330] flex justify-between items-end">
        <div>
          <div className="font-rajdhani font-bold text-xl text-orange leading-none">
            {formatPrice(price)}
          </div>
          {isDiscounted && (
            <div className="text-xs text-[#5a6475] line-through">{formatPrice(originalPrice!)}</div>
          )}
        </div>
        {seller && (
          <div className="text-right">
            <div className="text-xs text-[#5a6475]">{seller.username}</div>
            <div className="text-xs text-yellow-400">★★★★★</div>
          </div>
        )}
      </div>
    </Link>
  );
}
