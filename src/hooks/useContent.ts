import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value || ""; });
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useHeroContent() {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_content").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePartnerLogos() {
  return useQuery({
    queryKey: ["partner-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_logos").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useImpactMetrics() {
  return useQuery({
    queryKey: ["impact-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("impact_metrics").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useHowItWorks() {
  return useQuery({
    queryKey: ["how-it-works"],
    queryFn: async () => {
      const { data, error } = await supabase.from("how_it_works").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePageSections(page: string = "home") {
  return useQuery({
    queryKey: ["page-sections", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", page)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSectionContent(sectionKey: string) {
  return useQuery({
    queryKey: ["section-content", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("content")
        .eq("section_key", sectionKey)
        .eq("page", "home")
        .limit(1)
        .single();
      if (error) return null;
      return (data?.content as Record<string, string>) || null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useNavMenu() {
  return useQuery({
    queryKey: ["nav-menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_menu")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
