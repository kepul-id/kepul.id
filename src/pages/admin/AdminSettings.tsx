import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const [edits, setEdits] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(edits)) {
        const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); setEdits({}); toast.success("Settings saved!"); },
    onError: (e: any) => toast.error(e.message),
  });

  const labels: Record<string, string> = {
    whatsapp_number: "WhatsApp Number",
    whatsapp_link: "WhatsApp Link",
    email: "Email",
    phone_display: "Phone Display",
    app_store_url: "App Store URL",
    play_store_url: "Play Store URL",
    instagram_url: "Instagram URL",
    youtube_url: "YouTube URL",
    tagline: "Tagline",
    hashtag: "Hashtag",
    contact_cities: "Kota Layanan (untuk halaman Kontak & Footer)",
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        {isLoading ? <p>Loading...</p> : (
          <div className="glass-card p-6 space-y-4">
            {settings?.map((s) => (
              <div key={s.key}>
                <label className="text-sm font-medium block mb-1">{labels[s.key] || s.key}</label>
                <input
                  value={edits[s.key] ?? s.value ?? ""}
                  onChange={(e) => setEdits({ ...edits, [s.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
            ))}
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || Object.keys(edits).length === 0}>
              <Save className="w-4 h-4 mr-2" /> Save All Settings
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
