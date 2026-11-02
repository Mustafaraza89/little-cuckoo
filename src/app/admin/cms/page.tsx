import React from 'react';
import { prisma } from '@/lib/prisma';
import CMSManagerClient from '@/components/admin/CMSManagerClient';

export const revalidate = 0;

export default async function AdminCMSPage() {
  const sections = await prisma.cMSSection.findMany();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Homepage CMS Visual Editor</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          Customize customer-facing headlines, promotional campaigns, and brand storytelling without editing source code.
        </p>
      </div>

      <CMSManagerClient initialSections={sections} />
    </div>
  );
}
