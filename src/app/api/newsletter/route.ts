import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true, message: "با موفقیت عضو شدید" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ایمیل معتبر نیست" }, { status: 400 });
    }
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
