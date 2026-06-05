import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings, useNavMenu } from "@/hooks/useContent";
import logo from "@/assets/kepul-logo-tagline.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { data: menuItems } = useNavMenu();
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";

  const navLinks = menuItems?.map(item => ({
    label: item.label,
    path: item.path,
    external: item.open_in_new_tab,
  })) || [];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container-narrow mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center"><img src={logo} alt="Kepul" className="h-10 sm:h-14" /></Link>
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent">{link.label}</a>
            ) : (
              <Link key={link.path} to={link.path} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.path ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{link.label}</Link>
            )
          )}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild><a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-1.5" />WhatsApp</a></Button>
          <Button size="sm" asChild><a href="#download"><Download className="w-4 h-4 mr-1.5" />Download App</a></Button>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-accent">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
      {open && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container-narrow mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.external ? (
                <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent">{link.label}</a>
              ) : (
                <Link key={link.path} to={link.path} onClick={() => setOpen(false)} className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.path ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>{link.label}</Link>
              )
            )}
            <div className="pt-4 flex flex-col gap-2">
              <Button variant="outline" asChild><a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-1.5" />Hubungi WhatsApp</a></Button>
              <Button asChild><a href="#download"><Download className="w-4 h-4 mr-1.5" />Download App</a></Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
