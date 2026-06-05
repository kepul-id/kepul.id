import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function AdminSections() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-page-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", "home")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("page_sections")
        .update({ is_visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections"] });
      qc.invalidateQueries({ queryKey: ["page-sections"] });
      toast.success("Updated!");
    },
  });

  const reorder = async (index: number, direction: "up" | "down") => {
    if (!sections) return;
    const newSections = [...sections];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newSections.length) return;

    const tempOrder = newSections[index].sort_order;
    newSections[index].sort_order = newSections[swapIdx].sort_order;
    newSections[swapIdx].sort_order = tempOrder;

    setSaving(true);
    try {
      await supabase.from("page_sections").update({ sort_order: newSections[index].sort_order }).eq("id", newSections[index].id);
      await supabase.from("page_sections").update({ sort_order: newSections[swapIdx].sort_order }).eq("id", newSections[swapIdx].id);
      qc.invalidateQueries({ queryKey: ["admin-page-sections"] });
      qc.invalidateQueries({ queryKey: ["page-sections"] });
      toast.success("Reordered!");
    } catch {
      toast.error("Failed to reorder");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage Sections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Atur urutan dan visibilitas setiap section di homepage
          </p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {sections?.map((section, idx) => (
              <div
                key={section.id}
                className={`glass-card p-4 flex items-center justify-between gap-4 transition-opacity ${
                  !section.is_visible ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-6 text-center">
                    {section.sort_order}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{section.label}</p>
                    <p className="text-xs text-muted-foreground">{section.section_key}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {["corporate", "app_download", "final_cta", "how_it_works", "services", "impact", "awards", "media", "testimonials", "blog", "faq", "partners"].includes(section.section_key) && (
                    <Link to={`/admin/sections/${section.section_key}`} className="p-2 hover:bg-accent rounded-lg text-primary">
                      <Pencil className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => reorder(idx, "up")}
                    disabled={idx === 0 || saving}
                    className="p-2 hover:bg-accent rounded-lg disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reorder(idx, "down")}
                    disabled={idx === (sections?.length || 0) - 1 || saving}
                    className="p-2 hover:bg-accent rounded-lg disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      toggleVisibility.mutate({
                        id: section.id,
                        is_visible: !section.is_visible,
                      })
                    }
                    className={`p-2 rounded-lg ${
                      section.is_visible
                        ? "hover:bg-accent text-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    {section.is_visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
