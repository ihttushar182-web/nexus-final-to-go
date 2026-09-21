-- ─────────────────────────────────────────────────────────────────────────────
-- Nexus Lift — seed data
-- Mirrors the TypeScript content layer (/data) so a fresh database has the same
-- catalogue the website renders. Safe to re-run (upserts).
-- ─────────────────────────────────────────────────────────────────────────────

insert into organizations (id, name, type) values
  ('00000000-0000-0000-0000-000000000001', 'Nexus Lift', 'internal')
on conflict (id) do nothing;

insert into products (id, slug, name_bn, name_en, category, layer, short_description_bn, short_description_en,
                      original_price, current_price, status, featured, revision_count, billing)
values
  ('pbp-starter','professional-business-starter',
   'Professional Business Profile — Starter','Professional Business Profile — Starter',
   'brand-identity','identity',
   'যে ব্যবসার একটি পরিষ্কার, পেশাদার পরিচিতি দরকার।','For businesses that need a clear, professional introduction.',
   1900, 999, 'active', true, 2, 'one-time'),
  ('pbp-growth','professional-business-growth',
   'Professional Business Profile — Growth','Professional Business Profile — Growth',
   'brand-identity','identity',
   'আরও গভীরভাবে নিজেকে উপস্থাপন করতে চায় এমন ব্যবসার জন্য।','For businesses that want a deeper presentation.',
   2599, 1499, 'active', true, 2, 'one-time'),
  ('pbp-premium','professional-business-premium',
   'Professional Business Profile — Premium','Professional Business Profile — Premium',
   'brand-identity','identity',
   'সর্বোচ্চ স্তরের Business Profile।','The highest-tier business profile.',
   4499, 2999, 'active', true, 2, 'one-time'),
  ('brand-identity-system','brand-identity-system',
   'Brand Identity System','Brand Identity System','brand-identity','identity',
   'Logo, Visual System এবং Brand Guidelines।','Logo, visual system and brand guidelines.',
   null, 25000, 'active', true, 2, 'one-time'),
  ('sop-process-system','sop-process-system',
   'Custom SOP & Process System','Custom SOP & Process System','sop-operations','operations',
   'Manual Chaos থেকে Repeatable System।','From manual chaos to a repeatable system.',
   null, 45000, 'active', true, 2, 'one-time'),
  ('crm-customer-system','crm-customer-system',
   'CRM & Customer System','CRM & Customer System','crm-customer-systems','intelligence',
   'Customer Data এক জায়গায় রাখুন।','Keep your customer data in one place.',
   null, 60000, 'active', true, 2, 'one-time'),
  ('business-os-dashboard','business-os-dashboard',
   'Business OS & CEO Dashboard','Business OS & CEO Dashboard','business-os-dashboards','control',
   'আপনার Business এর Control Room তৈরি করুন।','Build your business control room.',
   null, 150000, 'active', true, 2, 'one-time')
on conflict (id) do update set
  current_price = excluded.current_price,
  original_price = excluded.original_price,
  status = excluded.status,
  featured = excluded.featured,
  updated_at = now();

insert into faq (id, question_bn, question_en, answer_bn, answer_en, category) values
  ('audit-free','Free Business Audit আসলে কি Free?','Is the Free Business Audit genuinely free?',
   'হ্যাঁ, ১০০% Free। কোনো Cost নেই, কোনো Obligation নেই।','Yes, 100% free. No cost, no obligation.','audit'),
  ('payment-methods','Payment কীভাবে করবো?','How do I pay?',
   'bKash, Nagad, Card এবং আবেদন সাপেক্ষে Bank Transfer।','bKash, Nagad, card and bank transfer on request.','payment'),
  ('working-hours','আপনাদের কর্মঘণ্টা কখন?','What are your working hours?',
   'সকাল ১০:০০ – বিকাল ৫:০০ (বাংলাদেশ সময়)।','10:00 AM – 5:00 PM Bangladesh time.','support')
on conflict (id) do nothing;

insert into settings (key, value, description) values
  ('business_hours', '{"start":"10:00","end":"17:00","timezone":"Asia/Dhaka"}', 'Public service hours'),
  ('contact', '{"email":"nexusliftbd@gmail.com","whatsapp":"+8801814716713","facebook":"https://www.facebook.com/nexusliftbd"}', 'Public contact channels'),
  ('checkout_enabled', 'false', 'Direct checkout is not the current sales mechanism')
on conflict (key) do update set value = excluded.value, updated_at = now();
