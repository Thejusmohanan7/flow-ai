import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import Hero from "@/components/hero/hero";
import Features from "@/components/features/features";
import Works from "@/components/works/works";
import Faq from "@/components/faq/faq";
import Cta from "@/components/cta/cta";
import Footer from "@/components/footer/footer";
export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features/>
      <Works/>
      <Faq/>
      <Cta/>
      <Footer/>
    </div>
  );
}
