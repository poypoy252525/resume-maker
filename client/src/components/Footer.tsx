import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
              <div className="bg-primary p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span>
                Resume <span className="text-primary">Architect</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-lg">
              The world's most advanced AI resume builder. We help you tell
              your professional story in a way that gets you hired.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <span className="text-sm">Follow us on Social Media</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-lg uppercase tracking-widest text-primary/80">
              Product
            </h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link
                  to="/resumes/new"
                  className="hover:text-primary transition-colors"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Job Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-lg uppercase tracking-widest text-primary/80">
              Resources
            </h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  ATS Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Resume Architect Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
