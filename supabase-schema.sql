-- Supabase Database Schema for Treasury Club Dashboard
-- Run this in your Supabase SQL Editor to create the tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (synced with auth.users via Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  name text,
  role text default 'member' check (role in ('treasurer', 'admin', 'member')),
  created_at timestamptz default now()
);

-- Categories table (for Budget, Activities, Prizes, Snacks)
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text default 'box',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Insert default categories
insert into public.categories (name, slug, description, icon) values
  ('Budget', 'budget', 'General budget expenses', 'budget'),
  ('Activities', 'activities', 'Club activities and events', 'activity'),
  ('Prizes', 'prizes', 'Prizes and rewards', 'prize'),
  ('Snacks', 'snacks', 'Snacks and refreshments', 'snack')
on conflict (slug) do nothing;

-- Transactions table
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  amount numeric(10, 2) not null,
  description text not null,
  category_id uuid references public.categories not null,
  user_id uuid references public.profiles not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  receipt_url text,
  merchant text,
  created_at timestamptz default now()
);

-- Budgets table (track budget limits per category)
create table if not exists public.budgets (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  amount numeric(10, 2) not null,
  spent numeric(10, 2) default 0,
  category_id uuid references public.categories not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz default now()
);

-- Audit logs for compliance
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  action text not null,
  table_name text not null,
  record_id uuid,
  user_id uuid references public.profiles,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.audit_logs enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin can manage all profiles"
  on public.profiles for all
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- RLS Policies for categories (all authenticated users can read)
create policy "Public can read categories"
  on public.categories for select
  using (true);

create policy "Admin/Treasurer can manage categories"
  on public.categories for all
  using (auth.uid() in (
    select id from public.profiles where role in ('admin', 'treasurer')
  ));

-- RLS Policies for transactions
create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Admin/Treasurer can read all transactions"
  on public.transactions for select
  using (auth.uid() in (
    select id from public.profiles where role in ('admin', 'treasurer')
  ));

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Admin/Treasurer can manage all transactions"
  on public.transactions for all
  using (auth.uid() in (
    select id from public.profiles where role in ('admin', 'treasurer')
  ));

-- RLS Policies for budgets
create policy "Public can read budgets"
  on public.budgets for select
  using (true);

create policy "Admin/Treasurer can manage budgets"
  on public.budgets for all
  using (auth.uid() in (
    select id from public.profiles where role in ('admin', 'treasurer')
  ));

-- RLS Policies for audit logs
create policy "Admin/Treasurer can read audit logs"
  on public.audit_logs for select
  using (auth.uid() in (
    select id from public.profiles where role in ('admin', 'treasurer')
  ));

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Indexes for performance
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_category_id on public.transactions(category_id);
create index if not exists idx_transactions_status on public.transactions(status);
create index if not exists idx_transactions_created_at on public.transactions(created_at);
create index if not exists idx_budgets_category_id on public.budgets(category_id);
