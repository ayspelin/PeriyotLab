import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Tüm alanları doldurun.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // For MVP, if not configured, just simulate success so the UI works
      console.log(`[Email Simulation] Name: ${name}, Email: ${email}, Msg: ${message}`);
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptionsCustomer = {
      from: `"PeriyotLab İletişim" <${process.env.SMTP_USER}>`, 
      to: email, // Müşteriye gidiyor
      subject: `Talebiniz Alındı: PeriyotLab`,
      text: `Sayın ${name},\n\nİletişim formunuz tarafımıza ulaşmıştır. En kısa sürede sizinle iletişime geçeceğiz.\n\nİlettiğiniz mesaj:\n${message}\n\nSaygılarımızla,\nPeriyotLab Ekibi`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #000;">Talebiniz Alınmıştır</h2>
          <p>Sayın <strong>${name}</strong>,</p>
          <p>Bize web sitemiz üzerinden ulaştığınız için teşekkür ederiz. Talebiniz ilgili birimimize iletilmiştir ve en kısa sürede size dönüş yapılacaktır.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;"><strong>İlettiğiniz Mesaj:</strong></p>
          <p style="font-size: 13px; font-style: italic; background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
            ${message.replace(/\n/g, '<br/>')}
          </p>
          <br/>
          <p style="font-size: 14px;">Saygılarımızla,<br/><strong>PeriyotLab Ekibi</strong></p>
        </div>
      `
    };

    const mailOptionsAdmin = {
      from: `"${name}" <${process.env.SMTP_USER}>`, 
      to: 'pelingilik1@gmail.com', // Şimdilik test için sabitlendi. Sonra process.env.CONTACT_RECEIVER_EMAIL yapılacak.
      replyTo: email,
      subject: `Yeni Web Talebi: ${name}`,
      text: `Web sitenizden yeni bir form dolduruldu:\n\nGönderen: ${name}\nE-Posta: ${email}\nMesaj:\n${message}`,
      html: `
        <h3>Yeni İletişim Formu Dolduruldu</h3>
        <p><strong>Müşteri Adı:</strong> ${name}</p>
        <p><strong>E-Posta Adresi:</strong> ${email}</p>
        <hr/>
        <p><strong>Mesaj:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    };

    // İki maili de gönderiyoruz (müşteriye ve admin'e)
    await transporter.sendMail(mailOptionsCustomer);
    await transporter.sendMail(mailOptionsAdmin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: 'Mail gönderilemedi.' }, { status: 500 });
  }
}
