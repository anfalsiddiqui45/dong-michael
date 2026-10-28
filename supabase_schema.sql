-- -- ==============================================================================
-- -- Supabase Schema for Professor Dr. Yunhao Michael Dong's Academic Website
-- -- ==============================================================================

-- -- 1. Site Content Table
-- create table if not exists public.site_content (
--   id text primary key,
--   page_data jsonb not null default '{}'::jsonb,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now()
-- );

-- -- Enable Row Level Security (RLS)
-- alter table public.site_content enable row level security;

-- -- Public read access: Anyone can view site content
-- drop policy if exists "Anyone can view site content" on public.site_content;
-- create policy "Anyone can view site content"
-- on public.site_content
-- for select
-- using (true);

-- -- Admin write access: Allows updates from admin interface
-- drop policy if exists "Allow update site content" on public.site_content;
-- create policy "Allow update site content"
-- on public.site_content
-- for update
-- using (true)
-- with check (true);

-- drop policy if exists "Allow insert site content" on public.site_content;
-- create policy "Allow insert site content"
-- on public.site_content
-- for insert
-- with check (true);

-- drop policy if exists "Allow delete site content" on public.site_content;
-- create policy "Allow delete site content"
-- on public.site_content
-- for delete
-- using (true);

-- -- ==============================================================================
-- -- 2. Storage Bucket & Policies for Profile Images
-- -- ==============================================================================

-- -- Ensure bucket exists and is public
-- insert into storage.buckets (id, name, public)
-- values ('profile-images', 'profile-images', true)
-- on conflict (id) do update set public = true;

-- -- Public read policy for images
-- drop policy if exists "Public read profile images" on storage.objects;
-- create policy "Public read profile images"
-- on storage.objects
-- for select
-- using (bucket_id = 'profile-images');

-- -- Administrator upload policy
-- drop policy if exists "Professor can upload profile image" on storage.objects;
-- create policy "Professor can upload profile image"
-- on storage.objects
-- for insert
-- with check (bucket_id = 'profile-images');

-- -- Administrator update policy
-- drop policy if exists "Professor can update profile image" on storage.objects;
-- create policy "Professor can update profile image"
-- on storage.objects
-- for update
-- using (bucket_id = 'profile-images')
-- with check (bucket_id = 'profile-images');

-- -- Administrator delete policy
-- drop policy if exists "Professor can delete profile image" on storage.objects;
-- create policy "Professor can delete profile image"
-- on storage.objects
-- for delete
-- using (bucket_id = 'profile-images');


-- ==============================================================================
-- Supabase Schema for Professor Dr. Yunhao Michael Dong's Academic Website
-- ==============================================================================

-- 1. Site Content Table
create table if not exists public.site_content (
  id text primary key,
  page_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.site_content enable row level security;

-- Public read access: Anyone can view site content
drop policy if exists "Anyone can view site content" on public.site_content;
create policy "Anyone can view site content"
on public.site_content
for select
using (true);

-- Admin write access: only logged-in (authenticated) users can modify content
drop policy if exists "Allow update site content" on public.site_content;
create policy "Allow update site content"
on public.site_content
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow insert site content" on public.site_content;
create policy "Allow insert site content"
on public.site_content
for insert
to authenticated
with check (true);

drop policy if exists "Allow delete site content" on public.site_content;
create policy "Allow delete site content"
on public.site_content
for delete
to authenticated
using (true);

-- ==============================================================================
-- 2. Storage Bucket & Policies for Profile Images
-- ==============================================================================

-- Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do update set public = true;

-- Public read policy for images
drop policy if exists "Public read profile images" on storage.objects;
create policy "Public read profile images"
on storage.objects
for select
using (bucket_id = 'profile-images');

-- Administrator upload policy
drop policy if exists "Professor can upload profile image" on storage.objects;
create policy "Professor can upload profile image"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'profile-images');

-- Administrator update policy
drop policy if exists "Professor can update profile image" on storage.objects;
create policy "Professor can update profile image"
on storage.objects
for update
to authenticated
using (bucket_id = 'profile-images')
with check (bucket_id = 'profile-images');

-- Administrator delete policy
drop policy if exists "Professor can delete profile image" on storage.objects;
create policy "Professor can delete profile image"
on storage.objects
for delete
to authenticated
using (bucket_id = 'profile-images');