create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

insert into public.profiles (id, email, display_name, created_at)
select
  id,
  coalesce(email, ''),
  raw_user_meta_data ->> 'display_name',
  created_at
from auth.users
on conflict (id) do nothing;

create table if not exists public.prestamos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  persona text not null,
  contacto text not null,
  objeto text not null,
  fecha timestamptz not null default now(),
  imagen_url text,
  estado text not null default 'activo' check (estado in ('activo', 'devuelto')),
  created_at timestamptz not null default now()
);

-- Keep this migration compatible with the prototype table if it already exists.
alter table public.prestamos add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.prestamos add column if not exists imagen_url text;
alter table public.prestamos add column if not exists created_at timestamptz not null default now();

create index if not exists prestamos_owner_created_idx
  on public.prestamos (owner_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.prestamos enable row level security;

revoke all on public.profiles from anon;
revoke all on public.prestamos from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.prestamos to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read their own loans" on public.prestamos;
create policy "Users can read their own loans"
  on public.prestamos for select
  to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create their own loans" on public.prestamos;
create policy "Users can create their own loans"
  on public.prestamos for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their own loans" on public.prestamos;
create policy "Users can update their own loans"
  on public.prestamos for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete their own loans" on public.prestamos;
create policy "Users can delete their own loans"
  on public.prestamos for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
