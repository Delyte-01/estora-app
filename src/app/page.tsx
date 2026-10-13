import AboutSection from "@/components/aboutSection";
import ContactCTA from "@/components/contactSection";
import FeaturedProperties from "@/components/feature-properties";

import Hero from "@/components/hero";

import ServicesSection from "@/components/serviceSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProperties />
      <AboutSection />
      <ServicesSection />
      <ContactCTA />
    </main>
  );
}
