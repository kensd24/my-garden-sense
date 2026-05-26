ALTER TABLE public.plants
  ADD COLUMN IF NOT EXISTS species text,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.plants
  ALTER COLUMN type DROP NOT NULL,
  ALTER COLUMN type SET DEFAULT 'herb';

ALTER TABLE public.plants
  ALTER COLUMN user_id SET DEFAULT auth.uid();