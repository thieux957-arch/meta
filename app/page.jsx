import About from "../components/About";
import Banner from "../components/Banner";
import Blog from "../components/Blog";
import Companies from "../components/Companies";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Service from "../components/Service";
import Testimonial from "../components/Testimonial";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Service />
      <Features />
      <About />
      <Pricing />
      <FAQ />
      <Testimonial />
      <Companies />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
}