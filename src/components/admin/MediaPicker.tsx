import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";
import { toast } from "sonner";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function MediaPicker({ value, onChange, label = "Image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data: files } = useQuery({
    queryKey: ["media-picker-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("media").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return data?.filter(f => f.name !== ".emptyFolderPlaceholder") || [];
    },
    enabled: open,
  });

  const getUrl = (name: string) => supabase.storage.from("media").getPublicUrl(name).data.publicUrl;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    const url = getUrl(path);
    onChange(url);
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["media-picker-files"] });
    toast.success("Uploaded & selected!");
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        {value && (
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
        )}
        <div className="flex-1">
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            placeholder="Image URL or pick from media"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
          Browse
        </Button>
      </div>

      {open && (
        <div className="mt-2 border border-border rounded-lg p-3 bg-background max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Media Library</p>
            <div className="flex gap-1">
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" />
              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="w-3 h-3 mr-1" /> {uploading ? "..." : "Upload"}
              </Button>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {files?.map((f) => {
              const url = getUrl(f.name);
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name);
              if (!isImage) return null;
              const selected = value === url;
              return (
                <button
                  key={f.name}
                  onClick={() => { onChange(url); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-colors ${selected ? "border-primary" : "border-transparent hover:border-accent"}`}
                >
                  <img src={url} alt={f.name} className="w-full h-16 object-cover" />
                  {selected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
