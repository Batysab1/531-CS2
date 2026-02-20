import { prisma } from "@/lib/prisma";
import { SkinsManager } from "./SkinsManager";

export default async function AdminSkinsPage() {
  const skins = await prisma.skin.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return <SkinsManager skins={skins} />;
}
