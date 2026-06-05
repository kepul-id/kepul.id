import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, X, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function AdminNavMenu() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-nav-menu"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_menu").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: any) => {
      const payload = {
        label: item.label,
        path: item.path,
        sort_order: item.sort_order || 0,
        is_visible: item.is_visible ?? true,
        open_in_new_tab: item.open_in_new_tab ?? false,
      };
      if (item.id) {
        const { error } = await supabase.from("nav_menu").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("nav_menu").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-nav-menu"] });
      qc.invalidateQueries({ queryKey: ["nav-menu"] });
      setEditing(null);
      toast.success("Saved!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nav_menu").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-nav-menu"] });
      qc.invalidateQueries({ queryKey: ["nav-menu"] });
      toast.success("Deleted!");
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from("nav_menu").update({ is_visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-nav-menu"] });
      qc.invalidateQueries({ queryKey: ["nav-menu"] });
    },
  });

  const reorder = async (index: number, direction: "up" | "down") => {
    if (!items) return;
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[index], b = items[swapIdx];
    await supabase.from("nav_menu").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("nav_menu").update({ sort_order: a.sort_order }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["admin-nav-menu"] });
    qc.invalidateQueries({ queryKey: ["nav-menu"] });
    toast.success("Reordered!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Navigation Menu</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola menu navigasi website</p>
          </div>
          <Button onClick={() => setEditing({ label: "", path: "/", sort_order: (items?.length || 0) + 1, is_visible: true, open_in_new_tab: false })}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Menu
          </Button>
        </div>

        {editing && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-bold text-foreground">{editing.id ? "Edit Menu" : "Menu Baru"}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Label</label>
                <input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="e.g. Home" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Path / URL</label>
                <input value={editing.path} onChange={(e) => setEditing({ ...editing, path: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="e.g. /tentang" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Sort Order</label>
                <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_visible} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} className="rounded" />
                  Visible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.open_in_new_tab} onChange={(e) => setEditing({ ...editing, open_in_new_tab: e.target.checked })} className="rounded" />
                  Open in new tab
                </label>
              </div>
            </div>
            <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {items?.map((item, idx) => (
              <div key={item.id} className={`glass-card p-4 flex items-center justify-between gap-4 ${!item.is_visible ? "opacity-50" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{item.label}</p>
                    {item.open_in_new_tab && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.path}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => reorder(idx, "up")} disabled={idx === 0} className="p-2 hover:bg-accent rounded-lg disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => reorder(idx, "down")} disabled={idx === (items?.length || 0) - 1} className="p-2 hover:bg-accent rounded-lg disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => toggleVisibility.mutate({ id: item.id, is_visible: !item.is_visible })} className="p-2 hover:bg-accent rounded-lg">
                    {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditing(item)} className="p-2 hover:bg-accent rounded-lg"><Save className="w-4 h-4 text-muted-foreground" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item.id); }} className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
