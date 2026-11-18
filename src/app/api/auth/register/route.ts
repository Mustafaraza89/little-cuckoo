import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Name, email, and password required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: 'CUSTOMER',
        isActive: false, // Pending verification
      },
    });

    // Verification required before login
    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: user.email,
      phone: user.phone,
      message: 'Account created. Please confirm your email or mobile number with the OTP code.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
