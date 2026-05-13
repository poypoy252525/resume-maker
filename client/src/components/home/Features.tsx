import { CheckCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
          <div className="flex-1 space-y-6">
            <div className="w-12 h-1 rounded-full bg-primary mb-4" />
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Designed for the <br />
              <span className="text-primary">Modern Recruiter</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Most resumes are rejected within 6 seconds. Our layouts are
              scientifically designed to capture attention and highlight your
              most relevant experience immediately.
            </p>
            <ul className="space-y-4">
              {[
                "Optimized visual hierarchy",
                "Perfect whitespace balance",
                "Readable typography for all devices",
                "Dynamic content sections",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full aspect-square relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-violet-600/20 rounded-[4rem] blur-3xl" />
            <div className="relative h-full border border-white/10 rounded-[3rem] bg-card overflow-hidden shadow-2xl">
              {/* Mock UI for Resume Preview */}
              <div className="p-8 space-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                <Skeleton className="w-1/3 h-8 bg-primary/20" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
                <Skeleton className="h-48 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
