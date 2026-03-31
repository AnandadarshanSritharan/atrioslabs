import Navbar from "../components/public/Navbar";
import Hero from "../components/public/Hero";
import Services from "../components/public/Services";
import About from "../components/public/About";
import Portfolio from "../components/public/Portfolio";
import WhyUs from "../components/public/WhyUs";
import Testimonials from "../components/public/Testimonials";
import Contact from "../components/public/Contact";
import Footer from "../components/public/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
