import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import SolutionsCarousel from "@/components/SolutionsCarousel";
import ClientSection from "@/components/ClientSection";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <SolutionsCarousel />
      <ClientSection />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
