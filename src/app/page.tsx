import { Navbar } from "@/components/Navbar";
import { ScrollHero } from "@/components/ScrollHero";
import { Story } from "@/components/Story";
import { Features } from "@/components/Features";
import { Menu } from "@/components/Menu";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollHero />
        <Story />
        <Features />
        <Menu />
        <Gallery />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
