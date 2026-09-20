import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import Advantages from "@/components/Advantages";
import Team from "@/components/Team";
import Reviews from "@/components/Reviews";
import Emergency from "@/components/Emergency";
import Shop from "@/components/Shop";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Booking />
        <Advantages />
        <Emergency />
        <Team />
        <Reviews />
        <Shop />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Reveal />
    </>
  );
}
