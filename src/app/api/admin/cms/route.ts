import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const sections = await prisma.cMSSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sectionKey, title, subtitle, content, ctaText, ctaLink, imageUrl, isEnabled } = body;

    const section = await prisma.cMSSection.upsert({
      where: { sectionKey },
      update: {
        title,
        subtitle,
        content,
        ctaText,
        ctaLink,
        imageUrl,
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      },
      create: {
        sectionKey,
        title,
        subtitle,
        content,
        ctaText,
        ctaLink,
        imageUrl,
        isEnabled: true,
      },
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
