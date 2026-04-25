import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FileText, Sparkles, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-10">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Resume Architect</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Craft Your Professional <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-500">
            Future Today
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create stunning, ATS-friendly resumes in minutes with our intelligent
          design system. Professional layouts tailored to your unique career
          path.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button
            asChild
            size="lg"
            className="h-14 px-8 text-lg rounded-2xl gap-2 shadow-xl shadow-primary/20"
          >
            <Link to="/resumes/new">
              <Wand2 className="w-5 h-5" />
              Create New Resume
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg rounded-2xl gap-2 border-primary/20 hover:bg-primary/5"
          >
            <FileText className="w-5 h-5" />
            View Templates
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          {[
            {
              title: "ATS Optimized",
              desc: "Pass through tracking systems with ease.",
            },
            {
              title: "Modern Design",
              desc: "Clean, professional layouts that stand out.",
            },
            {
              title: "Instant Export",
              desc: "Download as high-quality PDF ready to send.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
