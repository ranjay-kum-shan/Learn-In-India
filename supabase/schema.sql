-- =============================================================================
-- SysDesign Gym — Postgres schema (Supabase)
-- =============================================================================
-- Apply via:
--   psql "$DATABASE_URL" -f supabase/schema.sql
-- or via Supabase SQL editor.
-- Designed to be idempotent: re-running is safe.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- ENUMS
-- =============================================================================
do $$ begin
  create type plan_t as enum ('free', 'pro', 'student', 'annual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type difficulty_t as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status_t as enum ('draft', 'grading', 'graded', 'error');
exception when duplicate_object then null; end $$;

-- =============================================================================
-- USERS — extends auth.users
-- =============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan plan_t not null default 'free',
  total_xp int not null default 0,
  streak_days int not null default 0,
  last_active_on date,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_stripe_customer on public.users (stripe_customer_id);

-- =============================================================================
-- PROBLEMS
-- =============================================================================
create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  difficulty difficulty_t not null default 'medium',
  tags text[] not null default '{}',
  estimated_minutes int not null default 45,
  is_free boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists idx_problems_difficulty on public.problems (difficulty);
create index if not exists idx_problems_sort on public.problems (sort_order);

-- =============================================================================
-- RUBRICS  (versioned per problem)
-- =============================================================================
create table if not exists public.rubrics (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  version int not null,
  yaml text not null,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  unique (problem_id, version)
);

create index if not exists idx_rubrics_problem on public.rubrics (problem_id);

-- =============================================================================
-- CRITERIA  (one row per rubric criterion)
-- =============================================================================
create table if not exists public.criteria (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references public.rubrics(id) on delete cascade,
  external_id text not null,
  title text not null,
  weight numeric(5,2) not null,
  category text not null,
  signals text[] not null default '{}',
  anti_signals text[] not null default '{}',
  sort_order int not null default 100,
  unique (rubric_id, external_id)
);

create index if not exists idx_criteria_rubric on public.criteria (rubric_id);
create index if not exists idx_criteria_category on public.criteria (category);

-- =============================================================================
-- SUBMISSIONS
-- =============================================================================
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  rubric_id uuid not null references public.rubrics(id),
  design_json jsonb not null,
  transcript text not null default '',
  status submission_status_t not null default 'draft',
  overall_score int check (overall_score is null or (overall_score between 0 and 100)),
  overall_summary text,
  error_message text,
  created_at timestamptz not null default now(),
  graded_at timestamptz
);

create index if not exists idx_submissions_user on public.submissions (user_id);
create index if not exists idx_submissions_problem on public.submissions (problem_id);
create index if not exists idx_submissions_user_problem on public.submissions (user_id, problem_id, created_at desc);

-- =============================================================================
-- SCORES  (per-criterion result of a submission)
-- =============================================================================
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  criterion_id uuid not null references public.criteria(id),
  score int not null check (score between 0 and 3),
  evidence text not null default '',
  suggestion text not null default '',
  created_at timestamptz not null default now(),
  unique (submission_id, criterion_id)
);

create index if not exists idx_scores_submission on public.scores (submission_id);
create index if not exists idx_scores_criterion on public.scores (criterion_id);

-- =============================================================================
-- LATEST ATTEMPT per (user, problem)  — view
-- =============================================================================
create or replace view public.latest_attempts as
select distinct on (s.user_id, s.problem_id)
  s.id,
  s.user_id,
  s.problem_id,
  s.status,
  s.overall_score,
  s.created_at,
  s.graded_at
from public.submissions s
order by s.user_id, s.problem_id, s.created_at desc;

-- =============================================================================
-- AUTOMATIC USER ROW on signup (trigger on auth.users)
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- ROW-LEVEL SECURITY
-- =============================================================================
alter table public.users enable row level security;
alter table public.problems enable row level security;
alter table public.rubrics enable row level security;
alter table public.criteria enable row level security;
alter table public.submissions enable row level security;
alter table public.scores enable row level security;

-- USERS: owner-only
drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
  for select using (auth.uid() = id);

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
  for update using (auth.uid() = id);

-- PROBLEMS: published rows readable to everyone authenticated
drop policy if exists problems_read_published on public.problems;
create policy problems_read_published on public.problems
  for select using (is_published = true);

-- RUBRICS / CRITERIA: read-only to authenticated
drop policy if exists rubrics_read on public.rubrics;
create policy rubrics_read on public.rubrics
  for select using (true);

drop policy if exists criteria_read on public.criteria;
create policy criteria_read on public.criteria
  for select using (true);

-- SUBMISSIONS: only owner can CRUD
drop policy if exists submissions_select_self on public.submissions;
create policy submissions_select_self on public.submissions
  for select using (auth.uid() = user_id);

drop policy if exists submissions_insert_self on public.submissions;
create policy submissions_insert_self on public.submissions
  for insert with check (auth.uid() = user_id);

drop policy if exists submissions_update_self on public.submissions;
create policy submissions_update_self on public.submissions
  for update using (auth.uid() = user_id);

-- SCORES: visible if you own the parent submission
drop policy if exists scores_select_via_submission on public.scores;
create policy scores_select_via_submission on public.scores
  for select using (
    exists (
      select 1 from public.submissions s
      where s.id = scores.submission_id
        and s.user_id = auth.uid()
    )
  );

-- (Inserts to scores happen via service-role from the grader. RLS blocks anon.)
