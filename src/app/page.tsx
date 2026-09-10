import { Hero } from "@/components/Hero";
import { AlbumsSection } from "@/components/AlbumsSection";
import { ArchiveGallery } from "@/components/ArchiveGallery";
import { CuratorSection } from "@/components/CuratorSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main className="overflow-x-hidden w-full max-w-full relative flex flex-col">
      <Hero />
      <AlbumsSection />
      <ArchiveGallery />
      <CuratorSection />
      <Contact />
      <Footer />
    </main>
  );
}
