import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: "El nombre de usuario debe tener entre 3 y 20 caracteres." }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: "El nombre de usuario solo puede contener letras, números y guiones bajos." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: { equals: username, mode: "insensitive" } },
        ],
      },
    });

    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return NextResponse.json({ error: "Este email ya está registrado." }, { status: 400 });
      }
      return NextResponse.json({ error: "Este nombre de usuario ya está en uso." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        password: hashed,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
