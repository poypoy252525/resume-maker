import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sparkles,
  Wand2,
  FileText,
  Trophy,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-14 pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Architect v2.0</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-4 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Your Dream Job <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-violet-500 to-indigo-600">
              Starts with a Story
            </span>
          </h1>

          <p className="text-md md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Create a professional, high-impact resume in minutes. Our
            intelligent system optimizes every word for ATS systems and human
            eyes alike.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Button asChild size="lg" className="h-16 px-10 text-xl">
              <Link to="/create">
                <Wand2 className="w-6 h-6" />
                Build My Resume
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-xl">
              <FileText className="w-6 h-6" />
              Live Preview
            </Button>
          </div>

          {/* Social Proof/Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full pt-12 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
            {[
              { label: "Resumes Built", value: "50k+", icon: FileText },
              { label: "Success Rate", value: "94%", icon: Trophy },
              { label: "Active Users", value: "12k", icon: Users },
              { label: "ATS Pass Rate", value: "99.9%", icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-primary/5 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
