import { Header } from "@/components/Header";
import { AccountCard } from "@/components/AccountCard";
import { prisma } from "@/lib/prisma";
import { RANKS } from "@/lib/utils";

async function getAccounts(rank?: string, minPrice?: number, maxPrice?: number, prime?: boolean) {
  try {
    return await prisma.account.findMany({
      where: {
        isAvailable: true,
        ...(rank ? { rank } : {}),
        ...(prime !== undefined ? { prime } : {}),
        price: {
          ...(minPrice ? { gte: minPrice } : {}),
          ...(maxPrice ? { lte: maxPrice } : {}),
        },
      },
      include: { seller: { select: { username: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch { return []; }
}

export default async function CuentasPage({ searchParams }: { searchParams: Record<string, string> }) {
  const rank = searchParams.rank;
  const minPrice = searchParams.min ? Number(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? Number(searchParams.max) : undefined;
  const prime = searchParams.prime === "true" ? true : searchParams.prime === "false" ? false : undefined;

  const accounts = await getAccounts(rank, minPrice, maxPrice, prime);

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Cuentas <span className="text-orange">CS2</span></h1>
            <p className="text-[#5a6475] text-sm mt-1">{accounts.length} cuentas disponibles</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <form className="flex flex-col gap-4">
              <div className="card-base p-4">
                <h3 className="font-rajdhani font-bold text-white text-sm uppercase tracking-widest mb-3">Rank</h3>
                <select name="rank" defaultValue={rank || ""} className="input-field text-xs">
                  <option value="">Todos los ranks</option>
                  {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="card-base p-4">
                <h3 className="font-rajdhani font-bold text-white text-sm uppercase tracking-widest mb-3">Precio (USD)</h3>
                <div className="flex gap-2">
                  <input type="number" name="min" placeholder="Min" defaultValue={searchParams.min} className="input-field text-xs" />
                  <input type="number" name="max" placeholder="Max" defaultValue={searchParams.max} className="input-field text-xs" />
                </div>
              </div>

              <div className="card-base p-4">
                <h3 className="font-rajdhani font-bold text-white text-sm uppercase tracking-widest mb-3">Prime</h3>
                <select name="prime" defaultValue={searchParams.prime || ""} className="input-field text-xs">
                  <option value="">Todos</option>
                  <option value="true">Solo Prime</option>
                  <option value="false">Sin Prime</option>
                </select>
              </div>

              <button type="submit" className="btn-primary text-xs py-2">Aplicar filtros</button>
            </form>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {accounts.length === 0 ? (
              <div className="card-base p-16 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="font-rajdhani font-bold text-white text-xl mb-2">No hay cuentas disponibles</div>
                <p className="text-[#5a6475] text-sm">Prueba con otros filtros o vuelve más tarde.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {accounts.map((acc) => (
                  <AccountCard
                    key={acc.id}
                    id={acc.id}
                    title={acc.title}
                    rank={acc.rank}
                    hours={acc.hours}
                    year={acc.year}
                    prime={acc.prime}
                    faceitLevel={acc.faceitLevel}
                    price={acc.price}
                    originalPrice={acc.originalPrice}
                    isFeatured={acc.isFeatured}
                    seller={acc.seller}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
