import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="p-12 md:p-24 rounded-[4rem] bg-linear-to-br from-primary to-indigo-900 relative overflow-hidden text-center text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight">
              Ready to level up your career?
            </h2>
            <p className="text-xl md:text-2xl text-white/80">
              Join 50,000+ professionals who have accelerated their career
              with Resumaker.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button
                asChild
                size="lg"
                className="h-16 px-12 text-xl rounded-2xl bg-white text-primary hover:bg-white/90 gap-3 border-none"
              >
                <Link to="/create">
                  Get Started Now
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
