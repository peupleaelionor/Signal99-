-- SIGNAL99 — optional Supabase schema.
-- The MVP runs without a database (Stripe is the source of truth for payment,
-- results live in the visitor's browser). Apply this when you want server-side
-- persistence + cross-device retrieval.

create extension if not exists "pgcrypto";

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null,
  scores jsonb not null,
  dominant_signal text not null,
  secondary_signal text not null,
  result_payload jsonb,
  is_paid boolean not null default false,
  payment_id text,
  share_slug text unique,
  result_token text not null
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_session_id text unique not null,
  amount integer not null,
  currency text not null,
  status text not null,
  quiz_result_id uuid references quiz_results (id),
  email text
);

-- Delivery orders — the "never lose a payer" store for manual/semi-auto
-- delivery (payment link mode, or when automatic unlock fails).
create table if not exists delivery_orders (
  quiz_result_id text primary key,
  status text not null default 'manual',
  email text,
  handle text,
  payment_reference text,
  dominant_signal text,
  secondary_signal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Forward-compat for the credits system (not used in the MVP).
create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quiz_results_share_slug on quiz_results (share_slug);
create index if not exists idx_purchases_session on purchases (stripe_session_id);

-- Row Level Security: keep these tables server-only (service role writes via the
-- webhook). Do not expose them to the anon key without policies.
alter table quiz_results enable row level security;
alter table purchases enable row level security;
alter table delivery_orders enable row level security;
alter table credits enable row level security;
