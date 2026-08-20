create table if not exists reader_profiles (
  handle text primary key,
  class_code text not null,
  first_name text not null,
  last_prefix text not null,
  progress jsonb not null default '{"theme":"paper","fontScale":1,"lastBook":null,"books":{}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists reader_profiles_class_code_idx
  on reader_profiles (class_code, handle);
