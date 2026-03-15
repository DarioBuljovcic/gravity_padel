import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AboutCourts from "@/components/about-courts";
import BookingCTA from "@/components/booking-cta";
import Footer from "@/components/footer";
import Schema from "@/components/schema";

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Schema />
      <Navbar />
      
      <div className="relative">
        <Hero />
        
        <div id="about" className="relative z-10 transition-colors duration-500">
          <AboutCourts />
          <BookingCTA />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
