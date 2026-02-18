-- 1. Create Profiles Table (Public User Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  balance decimal(12, 2) default 1000.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create Policy: Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Create Policy: Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- 2. Create Portfolios Table (Holdings)
create table public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  team_id text not null, -- e.g., 'MICH', 'UGA'
  quantity integer default 0,
  avg_cost decimal(10, 2) default 0.00,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, team_id) -- One entry per team per user
);

alter table public.portfolios enable row level security;

create policy "Users can view own portfolio" on portfolios
  for select using (auth.uid() = user_id);

create policy "Users can update own portfolio" on portfolios
  for all using (auth.uid() = user_id);

-- 3. Create Transactions Table (History)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  team_id text not null,
  type text check (type in ('BUY', 'SELL')),
  quantity integer not null,
  price decimal(10, 2) not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on transactions
  for insert with check (auth.uid() = user_id);

-- 4. Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

  for each row execute procedure public.handle_new_user();

-- 5. Teams Table (Dynamic Market Data)
-- We strictly define IDs like 'cfb-1' to match existing frontend logic, or use UUIDs.
-- Text IDs are easier for the static-to-dynamic migration.
create table public.teams (
  id text primary key, -- e.g. 'cfb-1', 'cbb-4'
  name text not null,
  ticker text not null,
  sport text not null, -- 'CFB', 'CBB'
  price decimal(10, 2) not null,
  change decimal(10, 2) default 0.00,
  record text,
  rank integer,
  color text,
  initial text,
  prestige integer, -- 1-100
  hype integer,     -- 1-10
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teams enable row level security;
-- Everyone can view teams
create policy "Public teams are viewable by everyone." on teams for select using ( true );
-- Only admins/service role can update (we'll leave open for now or restrict later)
create policy "Everyone can update teams (Simulated)" on teams for update using ( true ); 
create policy "Everyone can insert teams (Seeding)" on teams for insert with check ( true );


-- 6. Leagues System
create table public.leagues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references public.profiles(id) not null,
  is_private boolean default false,
  entry_fee decimal(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leagues enable row level security;
create policy "Leagues are viewable by everyone." on leagues for select using ( true );
create policy "Users can create leagues." on leagues for insert with check ( auth.uid() = created_by );

create table public.league_members (
  id uuid default uuid_generate_v4() primary key,
  league_id uuid references public.leagues(id) not null,
  user_id uuid references public.profiles(id) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(league_id, user_id)
);

alter table public.league_members enable row level security;
create policy "Members are viewable by everyone." on league_members for select using ( true );
create policy "Users can join leagues." on league_members for insert with check ( auth.uid() = user_id );

-- 7. Friendships (Social)
create table public.friendships (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

alter table public.friendships enable row level security;
create policy "Users can view their own friendships." on friendships 
  for select using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users can request friendships." on friendships 
  for insert with check (auth.uid() = user_id);
create policy "Users can update friendships." on friendships 
  for update using (auth.uid() = user_id or auth.uid() = friend_id);

-- 8. Transaction Type Update (For Dividends)
-- Run this if you already created the table with the old check constraint
alter table public.transactions drop constraint if exists transactions_type_check;
alter table public.transactions add constraint transactions_type_check 
  check (type in ('BUY', 'SELL', 'DIVIDEND'));
