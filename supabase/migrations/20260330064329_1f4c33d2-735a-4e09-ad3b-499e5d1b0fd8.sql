
-- Awards/Penghargaan table
CREATE TABLE public.awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read awards" ON public.awards FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage awards" ON public.awards FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Media coverage logos table
CREATE TABLE public.media_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  link_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.media_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read media_logos" ON public.media_logos FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage media_logos" ON public.media_logos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  avatar_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read testimonials" ON public.testimonials FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Materials/pricing table (dynamic, replaces hardcoded data)
CREATE TABLE public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Plastik',
  price text NOT NULL DEFAULT '-',
  accepted boolean DEFAULT true,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read materials" ON public.materials FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage materials" ON public.materials FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- About page content table
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  content text,
  image_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read about_content" ON public.about_content FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage about_content" ON public.about_content FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Contact form submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  category text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact_submissions" ON public.contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can read contact_submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Add new page_sections for awards, media, testimonials
INSERT INTO public.page_sections (section_key, label, page, sort_order, is_visible, content) VALUES
  ('awards', 'Penghargaan', 'home', 7, true, '{"badge":"Penghargaan","headline":"Kepercayaan & Penghargaan","description":"Bukti nyata kontribusi Kepul dalam pengelolaan sampah di Indonesia."}'::jsonb),
  ('media', 'Media Coverage', 'home', 8, true, '{"badge":"Media","headline":"Kepul di Media","description":"Liputan media tentang Kepul dan kontribusinya."}'::jsonb),
  ('testimonials', 'Testimonial', 'home', 9, true, '{"badge":"Testimonial","headline":"Apa Kata Mereka","description":"Cerita dan pengalaman nyata dari pengguna Kepul."}'::jsonb);

-- Seed initial materials from the hardcoded data
INSERT INTO public.materials (name, category, price, accepted, sort_order) VALUES
  ('Botol PET', 'Plastik', 'Rp 2.000 - 3.500/kg', true, 1),
  ('Plastik HDPE', 'Plastik', 'Rp 1.500 - 2.500/kg', true, 2),
  ('Kardus', 'Kertas', 'Rp 1.000 - 2.000/kg', true, 3),
  ('Kertas HVS', 'Kertas', 'Rp 1.500 - 2.500/kg', true, 4),
  ('Koran', 'Kertas', 'Rp 1.000 - 1.800/kg', true, 5),
  ('Aluminium', 'Logam', 'Rp 8.000 - 12.000/kg', true, 6),
  ('Besi', 'Logam', 'Rp 2.500 - 4.000/kg', true, 7),
  ('Tembaga', 'Logam', 'Rp 50.000 - 80.000/kg', true, 8),
  ('Botol Kaca', 'Kaca', 'Rp 500 - 1.500/kg', true, 9),
  ('HP Bekas', 'Elektronik', 'Hubungi admin', true, 10),
  ('Styrofoam', 'Plastik', '-', false, 11),
  ('Plastik Kresek', 'Plastik', '-', false, 12);

-- Seed about page content
INSERT INTO public.about_content (section_key, title, content, sort_order) VALUES
  ('hero', 'Mengubah Cara Indonesia Mengelola Sampah', 'Kepul adalah layanan waste management modern yang membantu rumah tangga, bisnis, sekolah, dan komunitas mengelola sampah menjadi lebih mudah, bernilai, dan berdampak.', 1),
  ('visi', 'Visi', 'Menjadi platform waste management terdepan di Indonesia yang menjadikan pengelolaan sampah lebih mudah, bernilai, dan berdampak untuk semua.', 2),
  ('misi', 'Misi', '• Menyediakan layanan pengelolaan sampah yang praktis dan terjangkau\n• Membangun budaya pilah sampah di berbagai komunitas\n• Menciptakan nilai ekonomi dari sampah daur ulang\n• Mendukung target keberlanjutan lingkungan', 3);

-- Add site settings for contact area
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_cities', 'Jakarta, Tangerang, Medan, Binjai, Deli Serdang')
ON CONFLICT DO NOTHING;
