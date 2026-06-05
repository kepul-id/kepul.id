import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useContent";

export default function FloatingCTA() {
  const { data: settings } = useSiteSettings();
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
