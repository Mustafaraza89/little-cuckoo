import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Cookie Policy | Little Cuckoo',
  description: 'Cookie usage and tracking transparency for Little Cuckoo.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Transparency & Preferences
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Cookie Policy</h1>
        <p className="text-xs text-cocoa-500">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">1. What Are Cookies?</h3>
          <p>
            Cookies are small text files stored on your browser or device when you visit websites. They help remember your preferences, cart contents, and authentication status.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">2. Cookies We Use</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Essential Operation Cookies:</strong> Required to preserve your shopping cart items, wishlist selections, and account login token (<code className="font-mono text-charcoal-700">cuckoo_auth_token</code>).
            </li>
            <li>
              <strong>Performance & Analytics:</strong> Aggregate metrics that help us understand which baby clothing categories parents find most helpful.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">3. No Third-Party Data Selling</h3>
          <p>
            We do not sell cookie data or personal information to third-party ad brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">4. Controlling Cookies</h3>
          <p>
            You can configure your browser to reject or delete cookies at any time. Note that disabling essential cookies may impact your ability to checkout or save items to your wishlist.
          </p>
        </section>
      </div>
    </div>
  );
}
