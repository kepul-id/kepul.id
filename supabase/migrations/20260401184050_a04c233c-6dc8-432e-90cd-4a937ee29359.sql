
DO $$
DECLARE
  tbl TEXT;
  trg TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'about_content','awards','blog_posts','faqs','hero_content','how_it_works',
    'impact_metrics','materials','media_logos','nav_menu','page_sections',
    'partner_logos','services','site_settings','testimonials','contact_submissions'
  ])
  LOOP
    trg := 'update_' || tbl || '_updated_at';
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = trg
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()',
        trg, tbl
      );
    END IF;
  END LOOP;
END;
$$;
