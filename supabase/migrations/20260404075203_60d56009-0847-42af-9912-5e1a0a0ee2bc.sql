ALTER TABLE public.services ADD COLUMN slug text;
ALTER TABLE public.services ADD COLUMN detail_content text;

-- Set default slugs based on title
UPDATE public.services SET slug = lower(replace(replace(title, ' ', '-'), '.', '')) WHERE slug IS NULL;