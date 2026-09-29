import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import {
  CONTACT_SUCCESS_MESSAGE,
  PHONE_VALIDATION_MESSAGE,
  normalizeTrMobilePhone,
} from "@/lib/contactInfo";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageCount = 5;
const maxImageSize = 5 * 1024 * 1024;
const maxTotalImageSize = 15 * 1024 * 1024;

type ContactSubmission = {
  type: "contact";
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ServiceSubmission = {
  type: "service";
  name: string;
  company: string;
  phone: string;
  email: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  fault: string;
  notes: string;
  files: File[];
};

type Submission = ContactSubmission | ServiceSubmission;

function validationError(error: string, fieldErrors?: Record<string, string>) {
  return NextResponse.json({ success: false, error, fieldErrors }, { status: 400 });
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getFormString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^\w.\-ğüşöçıİĞÜŞÖÇ]+/gi, "-").replace(/-+/g, "-");
}

function validateBaseFields(name: string, email: string, phone: string) {
  if (!name) {
    return { field: "name", message: "Ad Soyad alanı zorunludur." };
  }

  if (!email) {
    return { field: "email", message: "E-posta alanı zorunludur." };
  }

  if (!emailRegex.test(email)) {
    return { field: "email", message: "Geçerli bir e-posta adresi giriniz." };
  }

  if (!phone) {
    return { field: "phone", message: "Telefon alanı zorunludur." };
  }

  if (!normalizeTrMobilePhone(phone)) {
    return { field: "phone", message: PHONE_VALIDATION_MESSAGE };
  }

  return null;
}

function assertRequired(value: string, field: string, message: string) {
  if (!value) {
    return { field, message };
  }

  return null;
}

function normalizePhoneOrThrow(phone: string) {
  const normalizedPhone = normalizeTrMobilePhone(phone);

  if (!normalizedPhone) {
    throw new Error(PHONE_VALIDATION_MESSAGE);
  }

  return normalizedPhone;
}

async function parseJsonSubmission(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return validationError("Form verisi okunamadı. Lütfen tekrar deneyin.");
  }

  const name = getString(body.name);
  const email = getString(body.email);
  const phone = getString(body.phone);
  const message = getString(body.message);

  const baseError = validateBaseFields(name, email, phone);
  if (baseError) {
    return validationError(baseError.message, { [baseError.field]: baseError.message });
  }

  const messageError = assertRequired(message, "message", "Mesaj alanı zorunludur.");
  if (messageError) {
    return validationError(messageError.message, { [messageError.field]: messageError.message });
  }

  const submission: ContactSubmission = {
    type: "contact",
    name,
    email,
    phone: normalizePhoneOrThrow(phone),
    message,
  };

  return submission;
}

async function parseMultipartSubmission(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return validationError("Form verisi okunamadı. Fotoğraf boyutlarını kontrol edip tekrar deneyin.");
  }

  const name = getFormString(formData, "name");
  const company = getFormString(formData, "company");
  const phone = getFormString(formData, "phone");
  const email = getFormString(formData, "email");
  const deviceType = getFormString(formData, "deviceType");
  const brand = getFormString(formData, "brand");
  const model = getFormString(formData, "model");
  const serialNumber = getFormString(formData, "serialNumber");
  const fault = getFormString(formData, "fault");
  const notes = getFormString(formData, "notes");
  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.name.length > 0);

  const baseError = validateBaseFields(name, email, phone);
  if (baseError) {
    return validationError(baseError.message, { [baseError.field]: baseError.message });
  }

  const requiredErrors = [
    assertRequired(company, "company", "Firma alanı zorunludur."),
    assertRequired(deviceType, "deviceType", "Cihaz Türü alanı zorunludur."),
    assertRequired(brand, "brand", "Marka alanı zorunludur."),
    assertRequired(model, "model", "Model alanı zorunludur."),
    assertRequired(fault, "fault", "Arıza / Problem Açıklaması alanı zorunludur."),
  ].filter(Boolean) as Array<{ field: string; message: string }>;

  if (requiredErrors[0]) {
    return validationError(requiredErrors[0].message, { [requiredErrors[0].field]: requiredErrors[0].message });
  }

  if (files.length > maxImageCount) {
    return validationError(`En fazla ${maxImageCount} fotoğraf yükleyebilirsiniz.`, {
      images: `En fazla ${maxImageCount} fotoğraf yükleyebilirsiniz.`,
    });
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > maxTotalImageSize) {
    return validationError("Fotoğrafların toplam boyutu 15 MB'ı geçmemelidir.", {
      images: "Fotoğrafların toplam boyutu 15 MB'ı geçmemelidir.",
    });
  }

  for (const file of files) {
    if (!allowedImageTypes.has(file.type)) {
      return validationError("Yalnızca jpg, jpeg, png veya webp formatında fotoğraf yükleyebilirsiniz.", {
        images: "Yalnızca jpg, jpeg, png veya webp formatında fotoğraf yükleyebilirsiniz.",
      });
    }

    if (file.size > maxImageSize) {
      return validationError("Her fotoğraf en fazla 5 MB olabilir.", {
        images: "Her fotoğraf en fazla 5 MB olabilir.",
      });
    }
  }

  const submission: ServiceSubmission = {
    type: "service",
    name,
    company,
    phone: normalizePhoneOrThrow(phone),
    email,
    deviceType,
    brand,
    model,
    serialNumber,
    fault,
    notes,
    files,
  };

  return submission;
}

async function parseSubmission(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    return parseMultipartSubmission(request);
  }

  if (contentType.includes("application/json")) {
    return parseJsonSubmission(request);
  }

  return validationError("Desteklenmeyen form gönderimi. Lütfen sayfayı yenileyip tekrar deneyin.");
}

async function getContactReceiverEmail() {
  if (process.env.CONTACT_RECEIVER_EMAIL) {
    return process.env.CONTACT_RECEIVER_EMAIL;
  }

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "contact_email" },
    });

    if (setting?.value) {
      return setting.value;
    }
  } catch (error) {
    console.error("[Contact API] Receiver e-mail setting could not be read:", getErrorDetails(error));
  }

  return process.env.SMTP_USER;
}

function getTransporter() {
  const missing = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`SMTP configuration is missing: ${missing.join(", ")}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

function getSubmissionTitle(submission: Submission) {
  return submission.type === "service" ? "Yeni Servis Talebi" : "Yeni İletişim Talebi";
}

function buildPlainText(submission: Submission) {
  if (submission.type === "service") {
    return [
      "Yeni servis talebi:",
      "",
      `Ad Soyad: ${submission.name}`,
      `Firma: ${submission.company}`,
      `Telefon: +90${submission.phone}`,
      `E-posta: ${submission.email}`,
      `Cihaz Türü: ${submission.deviceType}`,
      `Marka: ${submission.brand}`,
      `Model: ${submission.model}`,
      `Seri Numarası: ${submission.serialNumber || "-"}`,
      "",
      "Arıza / Problem Açıklaması:",
      submission.fault,
      "",
      "Ek Not:",
      submission.notes || "-",
      "",
      `Fotoğraf Sayısı: ${submission.files.length}`,
    ].join("\n");
  }

  return [
    "Yeni iletişim talebi:",
    "",
    `Ad Soyad: ${submission.name}`,
    `Telefon: +90${submission.phone}`,
    `E-posta: ${submission.email}`,
    "",
    "Mesaj:",
    submission.message,
  ].join("\n");
}

function buildAdminHtml(submission: Submission) {
  const rows =
    submission.type === "service"
      ? [
          ["Ad Soyad", submission.name],
          ["Firma", submission.company],
          ["Telefon", `+90${submission.phone}`],
          ["E-posta", submission.email],
          ["Cihaz Türü", submission.deviceType],
          ["Marka", submission.brand],
          ["Model", submission.model],
          ["Seri Numarası", submission.serialNumber || "-"],
          ["Fotoğraf Sayısı", String(submission.files.length)],
        ]
      : [
          ["Ad Soyad", submission.name],
          ["Telefon", `+90${submission.phone}`],
          ["E-posta", submission.email],
        ];

  const detailTitle = submission.type === "service" ? "Arıza / Problem Açıklaması" : "Mesaj";
  const detailText = submission.type === "service" ? submission.fault : submission.message;
  const notesHtml =
    submission.type === "service"
      ? `<h3 style="margin-top:24px">Ek Not</h3><p style="line-height:1.6">${textToHtml(submission.notes || "-")}</p>`
      : "";

  return `
    <div style="font-family:Arial,sans-serif;color:#222">
      <h2>${getSubmissionTitle(submission)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border:1px solid #e5e7eb;padding:10px;font-weight:700;background:#f8fafc;width:180px">${escapeHtml(label)}</td>
                  <td style="border:1px solid #e5e7eb;padding:10px">${escapeHtml(value)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <h3 style="margin-top:24px">${detailTitle}</h3>
      <p style="line-height:1.6;white-space:normal">${textToHtml(detailText)}</p>
      ${notesHtml}
    </div>
  `;
}

function buildCustomerText(submission: Submission) {
  const requestName = submission.type === "service" ? "servis talebiniz" : "iletişim talebiniz";

  return [
    `Sayın ${submission.name},`,
    "",
    `PeriyotLab web sitesi üzerinden ilettiğiniz ${requestName} tarafımıza ulaşmıştır.`,
    "En kısa sürede sizinle iletişime geçeceğiz.",
    "",
    "Saygılarımızla,",
    "PeriyotLab Ekibi",
  ].join("\n");
}

function buildCustomerHtml(submission: Submission) {
  const requestName = submission.type === "service" ? "servis talebiniz" : "iletişim talebiniz";

  return `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6">
      <h2 style="color:#111">Talebiniz Alınmıştır</h2>
      <p>Sayın <strong>${escapeHtml(submission.name)}</strong>,</p>
      <p>PeriyotLab web sitesi üzerinden ilettiğiniz ${requestName} tarafımıza ulaşmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
      <p>Saygılarımızla,<br /><strong>PeriyotLab Ekibi</strong></p>
    </div>
  `;
}

async function buildAttachments(submission: Submission) {
  if (submission.type !== "service" || submission.files.length === 0) {
    return [];
  }

  return Promise.all(
    submission.files.map(async (file) => ({
      filename: sanitizeFileName(file.name),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    }))
  );
}

function getErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { error };
  }

  const extra = error as Error & {
    code?: unknown;
    command?: unknown;
    responseCode?: unknown;
    response?: unknown;
  };

  return {
    name: error.name,
    message: error.message,
    code: extra.code,
    command: extra.command,
    responseCode: extra.responseCode,
    response: extra.response,
    stack: error.stack,
  };
}

export async function POST(request: Request) {
  try {
    const parsed = await parseSubmission(request);

    if (parsed instanceof NextResponse) {
      return parsed;
    }

    const receiverEmail = await getContactReceiverEmail();
    if (!receiverEmail) {
      throw new Error("Contact receiver e-mail is not configured.");
    }

    const transporter = getTransporter();
    await transporter.verify();

    const title = getSubmissionTitle(parsed);
    const attachments = await buildAttachments(parsed);
    const senderName = cleanHeader(parsed.name);

    await transporter.sendMail({
      from: `"PeriyotLab" <${process.env.SMTP_USER}>`,
      to: parsed.email,
      replyTo: receiverEmail,
      subject: "Talebiniz Alındı: PeriyotLab",
      text: buildCustomerText(parsed),
      html: buildCustomerHtml(parsed),
    });

    await transporter.sendMail({
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to: receiverEmail,
      replyTo: parsed.email,
      subject: `${title}: ${senderName}`,
      text: buildPlainText(parsed),
      html: buildAdminHtml(parsed),
      attachments,
    });

    return NextResponse.json({ success: true, message: CONTACT_SUCCESS_MESSAGE });
  } catch (error) {
    console.error("[Contact API] Mail send failed:", getErrorDetails(error));
    return NextResponse.json(
      {
        success: false,
        error: "Talebiniz şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya telefonla bize ulaşın.",
      },
      { status: 500 }
    );
  }
}
