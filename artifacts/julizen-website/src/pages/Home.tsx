import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductsSection } from "@/components/ProductsSection";
import { WhyJulizenSection } from "@/components/WhyJulizenSection";
import { FoodResultsSection } from "@/components/FoodResultsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SeoContentSection } from "@/components/SeoContentSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <WhyJulizenSection />
        <FoodResultsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <SeoContentSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
