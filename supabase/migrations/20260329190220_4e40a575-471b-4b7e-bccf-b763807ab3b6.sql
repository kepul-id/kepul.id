-- Fix Home path (corrupted)
UPDATE nav_menu SET path = '/' WHERE id = '66a63ee8-2c0d-40a1-b1c3-c67d5b309527';

-- Hide Dampak, Layanan
UPDATE nav_menu SET is_visible = false WHERE id = 'af8ad047-0d29-477a-9bcb-b1a45f0e3f75';
UPDATE nav_menu SET is_visible = false WHERE id = '63aeecea-e2b2-4451-bcd5-5533f9c114cf';

-- Fix BerawalDariKantor path
UPDATE nav_menu SET path = '/berawal-dari-kantor' WHERE id = '8b2f7b78-1e95-4cd0-b25b-7c81bca6892f';

-- Add final_cta section if not exists
INSERT INTO page_sections (section_key, label, page, sort_order, is_visible, content)
SELECT 'final_cta', 'Final CTA', 'home', 90, true, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE section_key = 'final_cta' AND page = 'home');
