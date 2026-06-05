import { useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, FolderOpen, FileVideo, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminMedia() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const results: any[] = [];
      // List root
      const { data: rootFiles } = await supabase.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      rootFiles?.forEach(f => { if (f.name !== ".emptyFolderPlaceholder") results.push({ ...f, folder: "" }); });
      // List blog subfolder
      const { data: blogFiles } = await supabase.storage.from("media").list("blog", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      blogFiles?.forEach(f => { if (f.name !== ".emptyFolderPlaceholder") results.push({ ...f, name: `blog/${f.name}`, folder: "blog" }); });
      return results;
    },
  });

  const getPublicUrl = (name: string) => supabase.storage.from("media").getPublicUrl(name).data.publicUrl;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) toast.error(`${file.name}: ${error.message}`);
      else toast.success(`${file.name} uploaded!`);
    }
    setUploading(false);
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this file?")) return;
    const { error } = await supabase.storage.from("media").remove([name]);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted!");
    qc.invalidateQueries({ queryKey: ["admin-media"] });
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  const isVideo = (name: string) => /\.(mp4|webm|mov|avi)$/i.test(name);

  const filtered = files?.filter(f => {
    if (filter === "image") return isImage(f.name);
    if (filter === "video") return isVideo(f.name);
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden text-sm">
              {(["all", "image", "video"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}>{f}</button>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{filtered?.length || 0} files</p>

        {isLoading ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered?.map((file) => {
              const url = getPublicUrl(file.name);
              return (
                <div key={file.name} className="glass-card overflow-hidden group">
                  {isImage(file.name) ? (
                    <img src={url} alt={file.name} className="w-full h-32 object-cover" loading="lazy" />
                  ) : isVideo(file.name) ? (
                    <video src={url} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground truncate">{file.name}</p>
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => { navigator.clipboard.writeText(url); toast.success("URL copied!"); }} className="p-1.5 hover:bg-accent rounded-lg" title="Copy URL"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(file.name)} className="p-1.5 hover:bg-destructive/10 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
