import { Zap, Sparkles, Download } from "lucide-react";

export default function Process() {
  return (
    <section className="py-24 bg-white/2 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Three Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg">
            We've streamlined the resume-building process so you can focus on
            what matters: landing the interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Choose Template & Input",
              desc: "Pick from our professional, ATS-optimized layouts (Modern, Classic, Minimal) and quickly fill in your details with no formatting required.",
              icon: Zap,
            },
            {
              step: "02",
              title: "AI Tailoring & Feedback",
              desc: "Submit a job description to automatically align your experiences, generate keyword suggestions, and view a comprehensive ATS compatibility score.",
              icon: Sparkles,
            },
            {
              step: "03",
              title: "Download & Apply",
              desc: "Export your beautifully tailored, professional resume as a high-quality PDF and confidently submit it to recruiters.",
              icon: Download,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group"
            >
              <div className="absolute -top-6 left-8 text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                {item.step}
              </div>
              <div className="mb-6 p-4 rounded-2xl bg-primary/10 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
