import Hero from "../components/home/Hero";
import Process from "../components/home/Process";
import Features from "../components/home/Features";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Process />
      <Features />
      <CTA />
    </div>
  );
}
