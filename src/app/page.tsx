import AboutSection from "@/components/aboutSection";
import ContactCTA from "@/components/contactSection";
import FeaturedProperties from "@/components/feature-properties";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/nav";
import ServicesSection from "@/components/serviceSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <AboutSection />
      <ServicesSection />
      <ContactCTA />
      <Footer />
    </main>
  );
}
