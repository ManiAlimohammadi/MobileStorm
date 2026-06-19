import nodemailer from "nodemailer";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderEmailData {
  orderId: string;
  trackingCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(Math.round(price * 1000)) + " تومان";
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      `SMTP not configured. Required env vars: SMTP_HOST="${host}", SMTP_USER="${user}", SMTP_PASS=${pass ? "set" : "MISSING"}`
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
  });
}

export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendOrderEmail(data: OrderEmailData, retries = 2): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "mani.nani.13.83@gmail.com";
  const user = process.env.SMTP_USER;

  const itemsHtml = data.items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
        <td style="padding:12px 16px;font-family:Tahoma,Arial,sans-serif;font-size:13px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${item.name}</td>
        <td style="padding:12px 16px;text-align:center;font-size:13px;color:#6b7280;border-bottom:1px solid #f3f4f6;">${item.quantity}</td>
        <td style="padding:12px 16px;text-align:left;font-size:13px;color:#4f46e5;font-weight:600;border-bottom:1px solid #f3f4f6;white-space:nowrap;">${formatPrice(item.price)}</td>
        <td style="padding:12px 16px;text-align:left;font-size:13px;color:#312e81;font-weight:700;border-bottom:1px solid #f3f4f6;white-space:nowrap;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>سفارش جدید - ${data.trackingCode}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Tahoma,Arial,sans-serif;">
<div style="max-width:660px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#818cf8 100%);padding:40px 40px 32px;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:4px 14px;margin-bottom:16px;">
      <span style="color:rgba(255,255,255,0.9);font-size:12px;letter-spacing:1px;">ایوِیز موبایل</span>
    </div>
    <h1 style="color:#fff;margin:0 0 8px;font-size:26px;font-weight:700;">🛒 سفارش جدید دریافت شد</h1>
    <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">
      کد پیگیری: <strong style="color:#fff;font-family:monospace;font-size:16px;letter-spacing:1px;">${data.trackingCode}</strong>
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px 40px;">

    <!-- Tracking card -->
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">کد رهگیری سفارش</p>
      <p style="margin:0;font-size:22px;font-weight:800;color:#4338ca;font-family:monospace;letter-spacing:2px;">${data.trackingCode}</p>
    </div>

    <!-- Customer info -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <h2 style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;">👤 اطلاعات خریدار</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;width:110px;">نام:</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;">موبایل:</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;direction:ltr;text-align:right;">${data.phone}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;vertical-align:top;">آدرس:</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;line-height:1.6;">${data.address}</td></tr>
        ${data.notes ? `<tr><td style="padding:5px 0;color:#6b7280;font-size:13px;vertical-align:top;">توضیحات:</td><td style="padding:5px 0;font-size:13px;color:#4b5563;">${data.notes}</td></tr>` : ""}
        <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;">تاریخ:</td><td style="padding:5px 0;font-size:13px;color:#6b7280;">${data.createdAt}</td></tr>
      </table>
    </div>

    <!-- Products table -->
    <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">📦 محصولات</h2>
    <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:11px 16px;text-align:right;font-size:12px;color:#374151;font-weight:600;">محصول</th>
          <th style="padding:11px 16px;text-align:center;font-size:12px;color:#374151;font-weight:600;">تعداد</th>
          <th style="padding:11px 16px;text-align:left;font-size:12px;color:#374151;font-weight:600;">قیمت واحد</th>
          <th style="padding:11px 16px;text-align:left;font-size:12px;color:#374151;font-weight:600;">جمع</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="margin-top:16px;background:linear-gradient(135deg,#4f46e5,#6366f1);border-radius:12px;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:rgba(255,255,255,0.9);font-size:16px;font-weight:600;">جمع کل سفارش:</span>
      <span style="color:#fff;font-size:20px;font-weight:800;">${formatPrice(data.totalAmount)}</span>
    </div>

    <!-- Action note -->
    <div style="margin-top:20px;padding:16px 20px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.7;">
        ⚡ لطفاً در اسرع وقت با مشتری تماس بگیرید و سفارش را تأیید نمایید.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">ایوِیز موبایل | فروشگاه لوازم جانبی موبایل</p>
  </div>
</div>
</body></html>`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"ایوِیز موبایل" <${user}>`,
        to: adminEmail,
        subject: `🛒 سفارش جدید | ${data.trackingCode} | ${data.firstName} ${data.lastName}`,
        html,
      });
      console.log(`✅ Order email sent to ${adminEmail} (attempt ${attempt})`);
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`❌ Email attempt ${attempt}/${retries + 1} failed:`, lastError.message);
      if (attempt <= retries) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }

  // Log for later manual retry — don't crash the order
  console.error("🚨 All email attempts failed. Order was saved. Manual resend required.", {
    orderId: data.orderId,
    trackingCode: data.trackingCode,
    adminEmail,
    error: lastError?.message,
  });
  throw lastError;
}
