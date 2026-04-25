import type { ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-primary/8 blur-[160px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-violet-600/6 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-indigo-500/4 blur-[120px]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>
              Resume <span className="text-primary">Architect</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              to="/resumes/new"
              className="hover:text-primary transition-colors"
            >
              Builder
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Templates
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/resumes/new"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
      <Toaster />
    </div>
  );
}
