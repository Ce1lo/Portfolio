import { Hero, StatsBand } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main id="top" className="relative flex flex-col">
      <Hero />
      <StatsBand />
      <Projects />
      <About />
      <Skills />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
