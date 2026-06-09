import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import MediaPicker from "@/components/admin/MediaPicker";

function CrudSection<T extends { id: string }>({
  title, queryKey, table, fields, defaultItem, orderBy,
}: {
  title: string; queryKey: string; table: string;
  fields: { key: string; label: string; type?: string }[];
  defaultItem: Record<string, any>;
  orderBy?: string;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order((orderBy || "sort_order") as any);
      if (error) throw error;
      return data as unknown as T[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: any) => {
      const payload: Record<string, any> = {};
      fields.forEach((f) => { payload[f.key] = item[f.key]; });
      if ("sort_order" in item) payload.sort_order = item.sort_order;
      if ("is_active" in item) payload.is_active = item.is_active;

      if (item.id) {
        const { error } = await supabase.from(table as any).update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setEditing(null); toast.success("Saved!"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Deleted!"); },
  });

  const filtered = (items as any[])?.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return fields.some(f => String(item[f.key] || "").toLowerCase().includes(q));
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm w-40 sm:w-56"
          />
          <Button onClick={() => setEditing({ ...defaultItem })}>
            <Plus className="w-4 h-4 mr-2" /> Tambah
          </Button>
        </div>
      </div>

      {editing && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-bold">Edit</h3><button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                <label className="text-sm font-medium block mb-1">{f.label}</label>
                {f.type === "image" ? (
                  <MediaPicker value={editing[f.key] || ""} onChange={(url) => setEditing({ ...editing, [f.key]: url })} label="" />
                ) : f.type === "textarea" ? (
                  <textarea value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
                ) : f.type === "number" ? (
                  <input type="number" value={editing[f.key] || 0} onChange={(e) => setEditing({ ...editing, [f.key]: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                ) : f.type === "boolean" ? (
                  <select value={editing[f.key] ? "true" : "false"} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value === "true" })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    <option value="true">Ya</option>
                    <option value="false">Tidak</option>
                  </select>
                ) : f.type === "array" ? (
                  <input value={Array.isArray(editing[f.key]) ? editing[f.key].join(", ") : editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Comma separated" />
                ) : (
                  <input value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                )}
              </div>
            ))}
            <div>
              <label className="text-sm font-medium block mb-1">Sort Order</label>
              <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {filtered?.length === 0 && !isLoading && <p className="text-muted-foreground text-sm">No items found.</p>}
        {filtered?.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
              {item.logo_url && <img src={item.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain flex-shrink-0" />}
              {item.avatar_url && <img src={item.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{item[fields[0].key]}</p>
                {fields[1] && <p className="text-xs text-muted-foreground truncate">{item[fields[1].key]}</p>}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing(item)} className="p-2 hover:bg-accent rounded-lg"><Save className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item.id); }} className="p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminServices() {
  return (
    <AdminLayout>
      <CrudSection title="Services" queryKey="admin-services" table="services" defaultItem={{ title: "", description: "", icon_name: "Recycle", image_url: "", slug: "", detail_content: "", features: [], sort_order: 0, is_active: true }}
        fields={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug (URL)" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "icon_name", label: "Icon Name (fallback)" },
          { key: "image_url", label: "Image / Icon", type: "image" },
          { key: "features", label: "Features", type: "array" },
          { key: "detail_content", label: "Detail Page Content", type: "textarea" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminPartners() {
  return (
    <AdminLayout>
      <CrudSection title="Partner Logos" queryKey="admin-partners" table="partner_logos" defaultItem={{ name: "", logo_url: "", sort_order: 0, is_active: true }}
        fields={[
          { key: "name", label: "Name" },
          { key: "logo_url", label: "Logo", type: "image" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminImpact() {
  return (
    <AdminLayout>
      <CrudSection title="Impact Metrics" queryKey="admin-impact" table="impact_metrics" defaultItem={{ value: 0, suffix: "+", label: "", sort_order: 0 }}
        fields={[
          { key: "label", label: "Label" },
          { key: "value", label: "Value", type: "number" },
          { key: "suffix", label: "Suffix" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminHowItWorks() {
  return (
    <AdminLayout>
      <CrudSection title="How It Works" queryKey="admin-howitworks" table="how_it_works" defaultItem={{ step_number: "", title: "", description: "", image_url: "", sort_order: 0 }}
        fields={[
          { key: "step_number", label: "Step Number" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "image_url", label: "Gambar Grafis", type: "image" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminFaq() {
  return (
    <AdminLayout>
      <CrudSection title="FAQ" queryKey="admin-faq" table="faqs" defaultItem={{ question: "", answer: "", sort_order: 0, is_active: true }}
        fields={[
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer", type: "textarea" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminAwards() {
  return (
    <AdminLayout>
      <CrudSection title="Awards / Penghargaan" queryKey="admin-awards" table="awards" defaultItem={{ title: "", description: "", image_url: "", sort_order: 0, is_active: true }}
        fields={[
          { key: "title", label: "Judul" },
          { key: "description", label: "Deskripsi", type: "textarea" },
          { key: "image_url", label: "Gambar", type: "image" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminMediaLogos() {
  return (
    <AdminLayout>
      <CrudSection title="Media Coverage" queryKey="admin-media-logos" table="media_logos" defaultItem={{ name: "", logo_url: "", link_url: "", sort_order: 0, is_active: true }}
        fields={[
          { key: "name", label: "Nama Media" },
          { key: "logo_url", label: "Logo", type: "image" },
          { key: "link_url", label: "Link Artikel" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminTestimonials() {
  return (
    <AdminLayout>
      <CrudSection title="Testimonial" queryKey="admin-testimonials" table="testimonials" defaultItem={{ name: "", role: "", content: "", avatar_url: "", sort_order: 0, is_active: true }}
        fields={[
          { key: "name", label: "Nama" },
          { key: "role", label: "Jabatan / Peran" },
          { key: "content", label: "Testimoni", type: "textarea" },
          { key: "avatar_url", label: "Foto", type: "image" },
        ]}
      />
    </AdminLayout>
  );
}



export function AdminAbout() {
  return (
    <AdminLayout>
      <CrudSection title="About Page Content" queryKey="admin-about" table="about_content" defaultItem={{ section_key: "", title: "", content: "", image_url: "", sort_order: 0 }} orderBy="sort_order"
        fields={[
          { key: "section_key", label: "Section Key" },
          { key: "title", label: "Judul" },
          { key: "content", label: "Konten", type: "textarea" },
          { key: "image_url", label: "Gambar", type: "image" },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminContactSubmissions() {
  return (
    <AdminLayout>
      <CrudSection title="Pesan Masuk" queryKey="admin-contacts" table="contact_submissions" defaultItem={{}} orderBy="created_at"
        fields={[
          { key: "name", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "category", label: "Kategori" },
          { key: "message", label: "Pesan", type: "textarea" },
        ]}
      />
    </AdminLayout>
  );
}
