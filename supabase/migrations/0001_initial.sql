-- Optional future backend. The mobile MVP currently operates locally and does not connect to this schema.
create extension if not exists pgcrypto;

create table public.child_profiles (
 id uuid primary key default gen_random_uuid(),
 parent_user_id uuid not null references auth.users(id) on delete cascade,
 nickname text not null check(char_length(nickname) between 1 and 40),
 avatar text not null default '🦊',
 created_at timestamptz not null default now()
);

create table public.speech_sounds (
 id text primary key,
 display_name text not null,
 description text not null default ''
);

create table public.exercise_items (
 id text primary key,
 sound_id text not null references public.speech_sounds(id),
 word text not null,
 position text not null check (position in ('initial','medial','final','isolation','syllable','sentence')),
 cue text not null default '',
 created_at timestamptz not null default now()
);

create table public.practice_sessions (
 id uuid primary key default gen_random_uuid(),
 child_id uuid not null references public.child_profiles(id) on delete cascade,
 started_at timestamptz not null default now(),
 completed_at timestamptz
);

create table public.speech_attempts (
 id uuid primary key default gen_random_uuid(),
 child_id uuid not null references public.child_profiles(id) on delete cascade,
 session_id uuid references public.practice_sessions(id) on delete set null,
 exercise_id text not null references public.exercise_items(id),
 evaluator_user_id uuid not null references auth.users(id),
 rating text not null check (rating in ('accurate','emerging','not_yet','skipped')),
 cue text not null check (cue in ('independent','verbal','visual','model')),
 created_at timestamptz not null default now()
);
create index on public.speech_attempts(child_id,created_at desc);
create index on public.practice_sessions(child_id,started_at desc);
create index on public.child_profiles(parent_user_id);

alter table public.child_profiles enable row level security;
alter table public.speech_sounds enable row level security;
alter table public.exercise_items enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.speech_attempts enable row level security;

create policy child_owner_all on public.child_profiles for all to authenticated
 using (parent_user_id = (select auth.uid()))
 with check (parent_user_id = (select auth.uid()));
create policy sounds_read on public.speech_sounds for select to authenticated using (true);
create policy items_read on public.exercise_items for select to authenticated using (true);

create policy session_select on public.practice_sessions for select to authenticated
 using (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));
create policy session_insert on public.practice_sessions for insert to authenticated
 with check (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));
create policy session_update on public.practice_sessions for update to authenticated
 using (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())))
 with check (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));
create policy session_delete on public.practice_sessions for delete to authenticated
 using (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));

create policy attempt_select on public.speech_attempts for select to authenticated
 using (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));
create policy attempt_insert on public.speech_attempts for insert to authenticated
 with check (
 evaluator_user_id = (select auth.uid())
 and exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid()))
 and (session_id is null or exists(select 1 from public.practice_sessions s where s.id = session_id and s.child_id = child_id))
 );
create policy attempt_delete on public.speech_attempts for delete to authenticated
 using (exists(select 1 from public.child_profiles c where c.id = child_id and c.parent_user_id = (select auth.uid())));

insert into public.speech_sounds(id,display_name,description) values
 ('s','S Sound','The snake sound'),('l','L Sound','The lion sound'),
 ('r','R Sound','The rabbit sound'),('sh','SH Sound','The quiet sound'),('ch','CH Sound','The train sound')
 on conflict (id) do nothing;
