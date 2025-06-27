import { Button } from "@/components/ui/button";
import HeaderFront from "./_components/HeaderFront";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";
import MarkSection from "./_components/MarkSection";
import FeatureSection from "./_components/FeatureSection";
import Stats from "./_components/Stats";
import HowItWorks from "./_components/HowItWorks";
import Faq from "./_components/faq";

export default function Home() {
  return (
    <div className="bg-[#0B1224] text-white overflow-x-hidden">
      <HeaderFront />
      <Hero />
      <FeatureSection />
      <MarkSection />
      <HowItWorks />
       <Stats />
      <Faq />

      <Footer />
    </div>
  );
}
