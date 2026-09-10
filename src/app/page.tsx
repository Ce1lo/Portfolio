import { Hero } from "@/components/Hero";
import { ArchiveGallery } from "@/components/ArchiveGallery";
import { AboutSection } from "@/components/AboutSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main className="overflow-x-hidden w-full max-w-full relative flex flex-col">
      <Hero />
      <ArchiveGallery />
      <AboutSection />
      <Contact />
      <Footer />
    </main>
  );
}
