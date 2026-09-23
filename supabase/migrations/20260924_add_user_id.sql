-- Add user_id column to job_applications and lock down RLS policies
-- so each user can only access their own data.

-- 1. Add user_id column (nullable first to handle existing rows)
alter table public.job_applications
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2. Create index for fast lookups by user
create index if not exists idx_job_applications_user_id
  on public.job_applications (user_id);

-- 3. Drop old public policies
drop policy if exists "job_applications_select_public" on public.job_applications;
drop policy if exists "job_applications_insert_public" on public.job_applications;
drop policy if exists "job_applications_update_public" on public.job_applications;
drop policy if exists "job_applications_delete_public" on public.job_applications;

-- 4. Create new user-scoped RLS policies
create policy "Users can view own applications"
  on public.job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.job_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.job_applications for delete
  using (auth.uid() = user_id);
