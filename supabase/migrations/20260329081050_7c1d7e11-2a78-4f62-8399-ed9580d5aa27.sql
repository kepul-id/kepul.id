
-- Page sections for homepage ordering/visibility
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT 'home',
  section_key text NOT NULL,
  label text NOT NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  content jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page, section_key)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read page_sections" ON public.page_sections FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage page_sections" ON public.page_sections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Navigation menu
CREATE TABLE public.nav_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  path text NOT NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  parent_id uuid REFERENCES public.nav_menu(id) ON DELETE SET NULL,
  open_in_new_tab boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read nav_menu" ON public.nav_menu FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage nav_menu" ON public.nav_menu FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Insert default homepage sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, is_visible) VALUES
  ('home', 'hero', 'Hero Section', 1, true),
  ('home', 'partners', 'Partner Logos', 2, true),
  ('home', 'corporate', '#BerawalDariKantor', 3, true),
  ('home', 'services', 'Layanan Kami', 4, true),
  ('home', 'how_it_works', 'Cara Kerja', 5, true),
  ('home', 'impact', 'Impact Metrics', 6, true),
  ('home', 'app_download', 'Download App', 7, true),
  ('home', 'blog', 'Blog Preview', 8, true),
  ('home', 'faq', 'FAQ', 9, true),
  ('home', 'final_cta', 'Final CTA', 10, true);

-- Insert default nav menu items
INSERT INTO public.nav_menu (label, path, sort_order, is_visible) VALUES
  ('Home', '/', 1, true),
  ('Tentang Kepul', '/tentang', 2, true),
  ('#BerawalDariKantor', '/berawal-dari-kantor', 3, true),
  ('Layanan', '/layanan', 4, true),
  ('Material & Harga', '/material-harga', 5, true),
  ('Dampak', '/dampak', 6, true),
  ('Blog', '/blog', 7, true),
  ('Kontak', '/kontak', 8, true);
