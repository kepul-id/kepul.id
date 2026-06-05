import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import MediaPicker from "@/components/admin/MediaPicker";

export default function AdminHero() {
  const qc = useQueryClient();
  const { data: hero, isLoading } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_content").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<any>(null);

  const update = (field: string, value: string) => setForm({ ...(form || hero), [field]: value });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const d = form || hero;
      const { error } = await supabase.from("hero_content").update({
        headline: d.headline, subheadline: d.subheadline, badge_text: d.badge_text,
        image_url: d.image_url, stat_number: d.stat_number, stat_label: d.stat_label,
      }).eq("id", d.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hero"] }); toast.success("Hero updated!"); },
    onError: (e: any) => toast.error(e.message),
  });

  const d = form || hero;
  if (isLoading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Hero Section</h1>
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Headline</label>
            <input value={d?.headline || ""} onChange={(e) => update("headline", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Subheadline</label>
            <textarea value={d?.subheadline || ""} onChange={(e) => update("subheadline", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Badge Text</label>
              <input value={d?.badge_text || ""} onChange={(e) => update("badge_text", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <MediaPicker
              label="Hero Image"
              value={d?.image_url || ""}
              onChange={(url) => update("image_url", url)}
            />
            <div>
              <label className="text-sm font-medium block mb-1">Stat Number</label>
              <input value={d?.stat_number || ""} onChange={(e) => update("stat_number", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Stat Label</label>
              <input value={d?.stat_label || ""} onChange={(e) => update("stat_label", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
