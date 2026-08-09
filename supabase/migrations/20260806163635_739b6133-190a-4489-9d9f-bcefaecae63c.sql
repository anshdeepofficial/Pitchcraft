CREATE TABLE public.shared_proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  business_name text NOT NULL DEFAULT '',
  markdown text NOT NULL DEFAULT '',
  summary text,
  password_hash text,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.shared_proposals TO service_role;

ALTER TABLE public.shared_proposals ENABLE ROW LEVEL SECURITY;