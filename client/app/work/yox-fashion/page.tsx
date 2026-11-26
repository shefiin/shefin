import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const caseStudySections = [
  {
    number: '01',
    title: 'Race-Condition-Safe Inventory Reservation & Compensating Rollback',
    problem:
      'Concurrent checkouts for limited-stock garment variants risk overselling, while partial failures in multi-item carts can leave inventory permanently decremented.',
    solution: [
      'Engineered AtomicStockService using atomic conditional database updates (available >= quantity).',
      'Added an in-process withVariantMutex fallback for non-atomic test repositories.',
      'Implemented a compensating rollback mechanism that automatically releases all previously reserved variants if any item in a multi-item checkout fails.'
    ],
    impact:
      'Eliminated overselling under concurrent load and guaranteed stock consistency across multi-item orders.'
  },
  {
    number: '02',
    title: 'Idempotent Payment Webhook Processing & Signature Verification',
    problem:
      'Asynchronous payment webhooks (Razorpay payment.captured, payment.failed, refund.processed) can arrive out of order, duplicate, or race against client-side verification callbacks.',
    solution: [
      'Built RazorpayWebhookUseCase with raw request body capture (req.rawBody) for strict HMAC-SHA256 signature verification.',
      'Paired with MongooseWebhookEventDeduplicator backed by a unique compound index on (provider, eventId).',
      'Duplicate PROCESSING/PROCESSED events are blocked, while FAILED events are atomically reclaimed via findOneAndUpdate for safe retries.'
    ],
    impact:
      'Guaranteed exactly-once financial reconciliation and prevented duplicate order confirmations or double stock deductions.'
  },
  {
    number: '03',
    title: 'Authoritative Server-Side Checkout Pricing Engine',
    problem:
      'Relying on client-supplied cart prices or stale cached totals exposes checkout to price tampering and promotion abuse.',
    solution: [
      'Architected CheckoutPricingService to ignore client-supplied prices.',
      'Dynamically resolves live catalog pricing, variant availability, active offer/coupon rules, store-wide tax inclusivity (taxRatePercent), and COD limits (codMaxLimit) directly from MongoDB.'
    ],
    impact:
      'Eliminated client-side price manipulation vectors and ensured deterministic financial calculations across cart, direct "Buy It Now", and webhook flows.'
  },
  {
    number: '04',
    title: 'Order Aggregate State Machine & Immutable Snapshots',
    problem:
      'Order lifecycles spanning placement, packing, Shiprocket dispatch, delivery, cancellation, and returns require strict transition guards and historical data integrity.',
    solution: [
      'Modeled Order as a Domain Aggregate Root enforcing OrderStatus and PaymentStatus invariants.',
      'Persisted immutable OrderItemSnapshot and ShippingAddressSnapshot value objects at order creation.'
    ],
    impact:
      'Prevented invalid state transitions and decoupled historical invoices/receipts from future catalog or address mutations.'
  },
  {
    number: '05',
    title: 'Passwordless OTP Authentication, Token Rotation & Granular RBAC',
    problem:
      'Supporting frictionless mobile-first customer sign-in alongside multi-tier admin/staff access requires strict privilege isolation and brute-force protection.',
    solution: [
      'Implemented phone-first OTP authentication (Msg91OtpService) with multi-account resolution.',
      'Configured separate signed JWT secrets (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_RESET_SECRET) validated at boot via Zod.',
      'Enforced route-level requireAuth / requirePermission middleware protected by helmet, CORS whitelisting, and express-rate-limit.'
    ],
    impact:
      'Isolated customer and staff/admin security boundaries and enforced fail-fast environment validation on startup.'
  },
  {
    number: '06',
    title: 'Low-Latency Caching, Zero-Downtime Deployment & Automated Backups',
    problem:
      'Maintaining fast storefront reads and reliable disaster recovery on a single-VPS production setup.',
    solution: [
      'Integrated Redis (ioredis) for storefront caching alongside Next.js SSR/ISR and Cloudinary CDN delivery.',
      'Automated zero-downtime PM2 reloads (yox-api, yox-web) via deploy.sh.',
      'Scheduled compressed mongodump --gzip backups with 7-day rolling retention via backup-db.sh.'
    ],
    impact:
      'Reduced database read pressure on catalog endpoints and established repeatable deployments with automated point-in-time recovery.'
  }
];

const stack = [
  'Next.js',
  'Express',
  'TypeScript',
  'Clean Architecture',
  'MongoDB',
  'Redis',
  'Razorpay',
  'PM2',
  'Hostinger VPS'
];

export default function YoxFashionCaseStudyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-mono py-16 px-6 sm:px-8 selection:bg-amber-100">
      <div className="max-w-[620px] mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>

          <a
            href="http://yoxfashion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition"
          >
            <span>yoxfashion.com</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-2">
            Case Study · Team Project
          </div>
          <h1 className="text-2xl sm:text-[26px] font-sans font-bold text-neutral-900 tracking-tight leading-snug mb-3">
            Yox Fashion
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            E-commerce platform engineered with Clean Architecture, atomic inventory reservation, idempotent Razorpay webhook reconciliation, and granular RBAC.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-[1px] rounded bg-neutral-100 text-neutral-600 border border-neutral-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Case Study Sections */}
        <div className="space-y-8">
          {caseStudySections.map((section) => (
            <section
              key={section.number}
              className="space-y-2.5 pb-6 border-b border-neutral-100 last:border-b-0"
            >
              <h2 className="text-sm font-sans font-semibold text-neutral-900">
                {section.title}
              </h2>

              <div className="space-y-2.5 text-[11.5px] leading-relaxed">
                <div>
                  <span className="font-semibold text-neutral-800">Problem: </span>
                  <span className="text-neutral-600">{section.problem}</span>
                </div>

                <div>
                  <span className="font-semibold text-neutral-800 block mb-1">
                    Solution:
                  </span>
                  <ul className="space-y-1 text-neutral-600 list-disc pl-4">
                    {section.solution.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <span className="font-semibold text-neutral-800">Impact: </span>
                  <span className="text-neutral-700">{section.impact}</span>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

