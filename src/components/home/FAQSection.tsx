import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFaqs, useSectionContent } from "@/hooks/useContent";

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: faqs } = useFaqs();
  const { data: content } = useSectionContent("faq");

  const items = faqs || [];
  const badge = content?.badge || "FAQ";
  const headline = content?.headline || "Pertanyaan Umum";
  const description = content?.description || "";

  return (
    <section id="faq" ref={ref} className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto max-w-3xl">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-sm font-medium text-primary">{badge}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{headline}</h2>
          {description && <p className="text-muted-foreground mt-3">{description}</p>}
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((faq, i) => (
            <AccordionItem key={faq.id} value={faq.id} className={`glass-card px-6 border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
