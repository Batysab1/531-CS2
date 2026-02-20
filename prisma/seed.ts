import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create superadmin
  const adminPassword = await bcrypt.hash("admin531!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@531accounts.com" },
    update: {},
    create: {
      email: "admin@531accounts.com",
      username: "Admin531",
      password: adminPassword,
      role: "SUPERADMIN",
    },
  });
  console.log(`✅ SuperAdmin creado: ${admin.email} / admin531!`);

  // Sample accounts
  const accounts = [
    {
      title: "Global Elite Prime — Medallas + 4200h",
      rank: "Global Elite",
      hours: 4200,
      year: 2014,
      prime: true,
      faceitLevel: 9,
      price: 94.99,
      originalPrice: 119.99,
      description: "Cuenta Global Elite con 12 medallas de operaciones. Ideal para streamers y jugadores serios.",
      credentials: "Credenciales se entregan via Discord tras la compra.",
      isAvailable: true,
      isFeatured: true,
      sellerId: admin.id,
    },
    {
      title: "Supreme Prime — Skins incluidas ~$200",
      rank: "Supreme Master First Class",
      hours: 2100,
      year: 2016,
      prime: true,
      faceitLevel: 7,
      price: 59.99,
      originalPrice: null,
      description: "Cuenta Supreme con inventario de skins valorado en ~$200 USD.",
      credentials: null,
      isAvailable: true,
      isFeatured: true,
      sellerId: admin.id,
    },
    {
      title: "Eagle Master — Cuenta Vintage 2013",
      rank: "Legendary Eagle Master",
      hours: 1540,
      year: 2013,
      prime: true,
      faceitLevel: 6,
      price: 39.99,
      originalPrice: 52.99,
      isAvailable: true,
      isFeatured: false,
      sellerId: admin.id,
    },
    {
      title: "DMG Prime — Rápido y económico",
      rank: "Distinguished Master Guardian",
      hours: 680,
      year: 2020,
      prime: true,
      price: 21.99,
      isAvailable: true,
      isFeatured: false,
      sellerId: admin.id,
    },
  ];

  for (const acc of accounts) {
    await prisma.account.create({ data: acc });
  }
  console.log(`✅ ${accounts.length} cuentas de ejemplo creadas.`);

  // Sample skins
  const skins = [
    { name: "Asiimov", weapon: "AWP", wear: "Field-Tested", float: 0.2341, price: 89.99, isAvailable: true, isFeatured: true },
    { name: "Hyper Beast", weapon: "M4A4", wear: "Factory New", float: 0.0123, price: 34.99, originalPrice: 44.99, isStatTrak: true, isAvailable: true, isFeatured: false },
    { name: "Dragon Lore", weapon: "AWP", wear: "Field-Tested", float: 0.3012, price: 1299.99, isAvailable: true, isFeatured: true },
    { name: "Fire Serpent", weapon: "AK-47", wear: "Minimal Wear", float: 0.0987, price: 299.99, isAvailable: true, isFeatured: false },
  ];

  for (const skin of skins) {
    await prisma.skin.create({ data: skin });
  }
  console.log(`✅ ${skins.length} skins de ejemplo creadas.`);

  console.log("\n🎉 Seed completado!");
  console.log("📋 SuperAdmin: admin@531accounts.com / admin531!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
