-- ─────────────────────────────────────────────────────────────────────────────
-- Nexus Lift — PostgreSQL / Supabase schema
-- Build Spec §28 (entities) + §29 (lead model) + §30 (order model)
--
-- Apply with:  supabase db push   (or)  psql "$DATABASE_URL" -f db/schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ───────────────────────────────── profiles / access ────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'team_member'
    check (role in ('ceo','manager','sales','marketing','delivery','support')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null default 'client' check (type in ('internal','client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────────────── catalogue ───────────────────────────────────
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name_bn text not null,
  name_en text not null,
  category text not null,
  layer text,
  short_description_bn text,
  short_description_en text,
  description_bn text,
  description_en text,
  target_customer_bn text,
  target_customer_en text,
  problem_bn text,
  problem_en text,
  outcome_bn text,
  outcome_en text,
  delivery_time_bn text,
  delivery_time_en text,
  delivery_format_bn text,
  delivery_format_en text,
  revision_count int,
  original_price numeric(12,2),
  current_price numeric(12,2),
  currency text not null default 'BDT',
  billing text not null default 'one-time' check (billing in ('one-time','monthly')),
  status text not null default 'draft' check (status in ('active','coming-soon','draft')),
  featured boolean not null default false,
  related_products text[] default '{}',
  seo_title_bn text,
  seo_title_en text,
  seo_description_bn text,
  seo_description_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_features (
  id uuid primary key default uuid_generate_v4(),
  product_id text not null references products(id) on delete cascade,
  locale text not null check (locale in ('bn','en')),
  sort_order int not null default 0,
  label text not null,
  kind text not null default 'feature' check (kind in ('feature','deliverable','requirement'))
);

create table if not exists product_faqs (
  id uuid primary key default uuid_generate_v4(),
  product_id text references products(id) on delete cascade,
  faq_id text not null,
  sort_order int not null default 0
);

-- ─────────────────────────────── leads / CRM ──────────────────────────────────
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  source text not null default 'website',
  channel text not null default 'web',
  business_name text,
  business_stage text,
  goal text,
  problem text,
  service_interest text,
  product_interest text,
  status text not null default 'new'
    check (status in ('new','qualified','contacted','interested','proposal','won','lost','nurture')),
  score int not null default 0,
  owner text,
  last_contact_at timestamptz,
  next_followup_at timestamptz,
  notes text,
  audit_submission_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_idx on leads(created_at desc);
create unique index if not exists leads_email_product_idx on leads(email, coalesce(product_interest,'')) where status <> 'lost';

create table if not exists lead_events (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null check (type in ('created','status_change','note','contact','audit','order')),
  message text not null,
  actor text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── business audit ───────────────────────────────
create table if not exists audit_submissions (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  business_link text,
  business_stage text not null,
  team_size text not null,
  biggest_problem text not null,
  current_tools text,
  goal text not null,
  name text not null,
  email text not null,
  whatsapp text not null,
  total_score int not null default 0,
  percent_score int not null default 0,
  weakest_layer text,
  priority_layer text,
  strongest_layer text,
  priority_reason_bn text,
  priority_reason_en text,
  source text default 'website',
  utm jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_created_idx on audit_submissions(created_at desc);
create index if not exists audit_email_idx on audit_submissions(email);

create table if not exists audit_answers (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references audit_submissions(id) on delete cascade,
  layer text not null check (layer in ('identity','structure','operations','growth','intelligence','control')),
  answer text not null check (answer in ('yes','partial','no')),
  score int not null default 0,
  unique (submission_id, layer)
);

-- ───────────────────────────── customers & orders ─────────────────────────────
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  business_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists customers_email_idx on customers(lower(email));

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid not null references customers(id) on delete restrict,
  lead_id uuid references leads(id) on delete set null,
  status text not null default 'inquiry'
    check (status in ('inquiry','pending_information','awaiting_payment','payment_verification',
                      'confirmed','in_production','revision_1','revision_2','final_review',
                      'delivered','after_sales','completed','cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','submitted','verified','rejected','adjustment_required')),
  payment_method text,
  payment_reference text,
  total numeric(12,2) not null default 0,
  currency text not null default 'BDT',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders(status);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_slug text not null,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(12,2) not null default 0
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  currency text not null default 'BDT',
  method text not null default 'bKash',
  status text not null default 'submitted'
    check (status in ('pending','submitted','verified','rejected','adjustment_required')),
  reference text,
  created_at timestamptz not null default now()
);

create table if not exists payment_events (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  type text not null check (type in ('submitted','verified','rejected','adjustment_required','note')),
  amount numeric(12,2) not null default 0,
  method text not null default 'bKash',
  reference text,
  actor text,
  created_at timestamptz not null default now()
);

create table if not exists revisions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  round int not null check (round in (1,2)),
  request text not null,
  status text not null default 'requested' check (status in ('requested','in_progress','delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  format text not null default 'PDF + Editable Word',
  file_url text,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

-- ───────────────────────────── conversations/support ──────────────────────────
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  channel text not null check (channel in ('whatsapp','messenger','email','web')),
  subject text,
  status text not null default 'open' check (status in ('open','pending','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  channel text not null check (channel in ('whatsapp','messenger','email','web')),
  body text not null,
  provider_message_id text,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','pending','resolved','closed')),
  channel text not null default 'web' check (channel in ('whatsapp','messenger','email','web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────────── content / policy / config ──────────────────────
create table if not exists content (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_bn text not null,
  title_en text not null,
  excerpt_bn text,
  excerpt_en text,
  body jsonb,
  category text,
  author text,
  featured_image text,
  schema_type text default 'BlogPosting',
  seo_title_bn text,
  seo_title_en text,
  seo_description_bn text,
  seo_description_en text,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists faq (
  id text primary key,
  question_bn text not null,
  question_en text not null,
  answer_bn text not null,
  answer_en text not null,
  category text not null default 'general',
  source text,
  sort_order int not null default 0
);

create table if not exists policies (
  slug text primary key,
  title_bn text not null,
  title_en text not null,
  intro_bn text,
  intro_en text,
  sections jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────── metrics & logs ───────────────────────────────
create table if not exists daily_metrics (
  id uuid primary key default uuid_generate_v4(),
  date date unique not null,
  mrr numeric(12,2) not null default 0,
  active_clients int not null default 0,
  new_leads int not null default 0,
  deals_won int not null default 0,
  open_tickets int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists webhook_logs (
  id uuid primary key default uuid_generate_v4(),
  endpoint text not null,
  event text not null,
  status text not null check (status in ('accepted','rejected','error')),
  detail text,
  payload jsonb,
  idempotency_key text,
  created_at timestamptz not null default now()
);
create unique index if not exists webhook_idempotency_idx
  on webhook_logs(endpoint, idempotency_key) where idempotency_key is not null;

create table if not exists app_logs (
  id uuid primary key default uuid_generate_v4(),
  level text not null check (level in ('info','warn','error')),
  scope text not null,
  message text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── dashboard view ───────────────────────────────
create or replace view dashboard_ceo_overview as
select
  (select coalesce(sum(mrr),0) from daily_metrics where date = current_date) as current_mrr,
  (select count(*) from organizations where type = 'client') as active_clients,
  (select count(*) from leads where created_at > now() - interval '7 days') as new_leads_week,
  (select count(*) from leads where status not in ('won','lost')) as open_leads,
  (select count(*) from orders where status not in ('completed','cancelled')) as active_projects,
  (select count(*) from orders where payment_status in ('submitted','pending')) as pending_payments,
  (select count(*) from support_tickets where status = 'open') as open_tickets;

-- ────────────────────────── row level security baseline ───────────────────────
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table leads enable row level security;
alter table lead_events enable row level security;
alter table audit_submissions enable row level security;
alter table audit_answers enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table payment_events enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table support_tickets enable row level security;
alter table webhook_logs enable row level security;
alter table app_logs enable row level security;

-- Staff-only access. Anonymous visitors never read these tables directly:
-- writes happen through server routes using the service role.
create policy "staff read profiles" on profiles for select
  using (auth.uid() = id);

create policy "staff read leads" on leads for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff write leads" on leads for all
  using (exists (select 1 from profiles p where p.id = auth.uid()))
  with check (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read audits" on audit_submissions for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read audit answers" on audit_answers for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read customers" on customers for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read orders" on orders for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read messages" on messages for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "staff read tickets" on support_tickets for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

-- Public catalogue is readable, writes are service-role only.
alter table products enable row level security;
alter table product_features enable row level security;
alter table product_faqs enable row level security;
alter table content enable row level security;
alter table faq enable row level security;
alter table policies enable row level security;

create policy "public read products" on products for select using (status <> 'draft');
create policy "public read product features" on product_features for select using (true);
create policy "public read product faqs" on product_faqs for select using (true);
create policy "public read content" on content for select using (published_at is not null);
create policy "public read faq" on faq for select using (true);
create policy "public read policies" on policies for select using (true);

-- ─────────────────────────────── updated_at trigger ───────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['profiles','organizations','products','leads','customers','orders',
                            'revisions','conversations','support_tickets','content','settings']
  loop
    execute format('drop trigger if exists set_updated_at on %I', t);
    execute format('create trigger set_updated_at before update on %I
                    for each row execute function set_updated_at()', t);
  end loop;
end $$;
