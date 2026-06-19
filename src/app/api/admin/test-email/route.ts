import { NextResponse } from "next/server";
import { verifySmtp, sendOrderEmail } from "@/lib/email";

export async function GET() {
  const smtpStatus = await verifySmtp();

  const config = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS ? "✅ set" : "❌ MISSING",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  return NextResponse.json({ smtp: smtpStatus, config });
}

export async function POST() {
  const smtpStatus = await verifySmtp();
  if (!smtpStatus.ok) {
    return NextResponse.json({ error: "SMTP verification failed", detail: smtpStatus.error }, { status: 500 });
  }

  try {
    await sendOrderEmail({
      orderId: "test-order-id",
      trackingCode: "EW-2026-TESTCODE",
      firstName: "مانی",
      lastName: "علی‌محمدی",
      phone: "09121234567",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      notes: "این یک سفارش آزمایشی است",
      items: [
        { name: "کابل شارژ سامسونگ 1 متری", quantity: 2, price: 185 },
        { name: "شارژر دیواری 25W", quantity: 1, price: 420 },
      ],
      totalAmount: 790,
      createdAt: new Date().toLocaleString("fa-IR"),
    });

    return NextResponse.json({ success: true, message: "Test email sent successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Email sending failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
