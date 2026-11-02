import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
