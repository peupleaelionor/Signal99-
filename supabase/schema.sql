-- SIGNAL99 — optional Supabase schema.
-- The MVP runs without a database (Stripe is the source of truth for payment,
-- results live in the visitor's browser). Apply this when you want server-side
-- persistence + cross-device retrieval.

create extension if not exists "pgcrypto";

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- answers/scores default to '{}' so the secure server flow can persist a
  -- minimal row at quiz time (only what payment binding + recovery need).
  answers jsonb not null default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  dominant_signal text not null,
  secondary_signal text not null,
  result_payload jsonb,
  collection_seed text,
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

-- Manual delivery fallback — "never lose someone who paid".
-- Captures email / social handle when automatic unlock fails (payment_link mode,
-- webhook lag, cleared cache). Never grants access by itself.
create table if not exists delivery_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  handle text,
  payment_reference text,
  quiz_result_id text,
  fulfilled boolean not null default false
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
alter table delivery_requests enable row level security;
alter table credits enable row level security;
