import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";

export default function AdminBlog() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (post: any) => {
      const payload = {
        title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
        category: post.category, tags: post.tags, image_url: post.image_url,
        is_published: post.is_published, published_at: post.is_published ? new Date().toISOString() : null,
      };
      if (post.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setEditing(null); setCreating(false); toast.success("Blog saved!"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Blog deleted!"); },
  });

  const emptyPost = { title: "", slug: "", excerpt: "", content: "", category: "", tags: [], image_url: "", is_published: false };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <Button onClick={() => { setCreating(true); setEditing(emptyPost); }}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Blog
          </Button>
        </div>

        {(editing || creating) && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-foreground">{creating ? "Buat Blog Baru" : "Edit Blog"}</h3>
              <button onClick={() => { setEditing(null); setCreating(false); }}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Slug</label>
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </div>
              <MediaPicker
                label="Featured Image"
                value={editing.image_url || ""}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Excerpt</label>
              <input value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Content</label>
              <RichTextEditor
                content={editing.content || ""}
                onChange={(html) => setEditing({ ...editing, content: html })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Tags (comma separated)</label>
              <input value={editing.tags?.join(", ") || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="rounded" />
                Published
              </label>
              <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {posts?.map((post) => (
            <div key={post.id} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {post.image_url && <img src={post.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${post.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.category} • {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(post); setCreating(false); }} className="p-2 hover:bg-accent rounded-lg"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }} className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
