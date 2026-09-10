import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const publicRegistrationEnabled = process.env.ALLOW_ADMIN_REGISTRATION === "true";

    if (!session && !publicRegistrationEnabled) {
      return NextResponse.json(
        { error: "Yönetici kaydı kapalı. Lütfen mevcut yönetici hesabıyla giriş yapın." },
        { status: 403 }
      );
    }

    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-Posta ve Şifre zorunludur" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json({ success: true, message: "Kayıt başarılı", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: "Kayıt olurken bir hata oluştu" }, { status: 500 });
  }
}
