import ResumeForm from "../components/ResumeForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NewResume() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          asChild
          className="gap-2 -ml-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
          Resume Architect
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Fill in your details below to craft your professional story. Our AI
          will handle the layout and formatting for you.
        </p>
      </div>

      <ResumeForm />
    </div>
  );
}
