import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutCourts from "@/components/AboutCourts";
import Pricing from "@/components/Pricing";
import BookingCTA from "@/components/BookingCta";
import Footer from "@/components/Footer";
import Schema from "@/components/schema";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import { LatestBlogs } from "@/components/LatestBlogs";

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Schema />
      <Navbar />

      <div className="relative">
        <Hero />
        <About />
        <AboutCourts />
        <LatestBlogs />
        <Gallery />
        <Pricing />
        <BookingCTA />
        <Footer />
      </div>
    </main>
  );
}
