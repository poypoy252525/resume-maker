import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Upload, Loader2, FileText, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";

export type ResumeTemplateId = "modern" | "classic" | "minimal";
type WizardStep = "select_method" | "choose_template" | "import_pdf";

interface TemplatePickerProps {
  onSelect: (template: ResumeTemplateId) => void;
}

export default function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const { importResume, isImporting } = useResumeStore();
  const [step, setStep] = useState<WizardStep>("select_method");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Extracting raw text from PDF...",
    "Scanning contact information...",
    "Structuring work experience...",
    "Formatting educational history...",
    "Extracting skills and final details...",
    "Structuring builder fields...",
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isImporting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isImporting]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        try {
          await importResume(file);
        } catch (err) {
          // Handled by store
        }
      } else {
        toast.error("Please upload a PDF file.");
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await importResume(file);
      } catch (err) {
        // Handled by store
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const templates = [
    {
      id: "modern" as const,
      title: "Modern",
      description: "Clean sans-serif typography, header borders, and blue accents. Best for tech, startup, and design roles.",
      preview: (
        <div className="w-full aspect-210/297 bg-white text-slate-800 rounded-xl p-3 flex flex-col space-y-2.5 h-48 overflow-hidden select-none border border-slate-200 font-sans shadow-xs">
          {/* Header */}
          <div className="text-left">
            <h4 className="text-[7.5px] font-extrabold text-slate-900 uppercase tracking-tight leading-tight">Jonathan Doe</h4>
            <p className="text-[5px] font-semibold text-primary mt-0.5 leading-none">Software Engineer</p>
            <div className="flex flex-col gap-0.5 mt-1 text-[3.8px] text-slate-500 font-medium leading-none">
              <div className="flex items-center gap-0.5">
                <Mail className="w-1 h-1 text-slate-400" />
                <span>jonathan.doe@email.com</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Phone className="w-1 h-1 text-slate-400" />
                <span>(555) 019-2834</span>
              </div>
              <div className="flex items-center gap-0.5">
                <MapPin className="w-1 h-1 text-slate-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* Divider line */}
          <div className="border-b border-slate-200 w-full" />

          {/* Professional Summary */}
          <div className="space-y-0.5">
            <h5 className="text-[4.5px] font-bold uppercase tracking-wider text-slate-500 leading-none">Professional Summary</h5>
            <p className="text-[3.8px] leading-[4.8px] text-slate-650">
              Results-driven Software Engineer with 5+ years of experience building and deploying scalable web applications using React, Node.js, and TypeScript.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-0.5">
            <h5 className="text-[4.5px] font-bold uppercase tracking-wider text-slate-500 leading-none">Experience</h5>
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline leading-none">
                <span className="text-[4px] font-bold text-slate-900">Senior Software Engineer</span>
                <span className="text-[3.5px] text-slate-400 font-medium">2023 — Pres.</span>
              </div>
              <div className="flex justify-between items-baseline leading-none">
                <span className="text-[3.8px] font-medium text-slate-700">TechCorp Inc.</span>
                <span className="text-[3.5px] italic text-slate-400">San Francisco, CA</span>
              </div>
              <div className="space-y-0.5 text-slate-650 mt-0.5">
                <p className="text-[3.8px] leading-[4.8px] pl-1.5 relative">
                  <span className="absolute left-0 text-slate-400">•</span>
                  Led design and implementation of a new API Gateway, reducing latency by 35%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "classic" as const,
      title: "Classic",
      description: "Traditional centered serif design with bullet spacing. Perfect for corporate, finance, law, or academic roles.",
      preview: (
        <div className="w-full aspect-210/297 bg-white text-slate-800 rounded-xl p-3 flex flex-col space-y-2.5 h-48 overflow-hidden select-none border border-slate-200 font-serif shadow-xs">
          {/* Header */}
          <div className="text-center space-y-0.5">
            <h4 className="text-[8px] font-bold text-slate-900 uppercase tracking-wider leading-tight">Jonathan Doe</h4>
            <p className="text-[3.8px] text-slate-500 font-medium leading-none">
              jonathan.doe@email.com  •  (555) 019-2834  •  San Francisco, CA
            </p>
          </div>

          {/* Professional Summary */}
          <div className="space-y-0.5 text-center">
            <h5 className="text-[4.5px] font-bold uppercase tracking-[0.15em] text-slate-900 leading-none">Professional Summary</h5>
            <p className="text-[3.8px] leading-[4.8px] text-slate-650 px-1 text-center">
              Results-driven Software Engineer with 5+ years of experience building and deploying scalable web applications using React, Node.js, and TypeScript.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-0.5">
            <h5 className="text-[4.5px] font-bold uppercase tracking-[0.15em] text-slate-900 text-center leading-none">Professional Experience</h5>
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline leading-none">
                <span className="text-[4px] font-bold text-slate-900">Senior Software Engineer</span>
                <span className="text-[3.5px] text-slate-400 font-medium">2023 — Pres.</span>
              </div>
              <div className="flex justify-between items-baseline leading-none">
                <span className="text-[3.8px] font-bold text-slate-700">TechCorp Inc.</span>
                <span className="text-[3.5px] italic text-slate-400">San Francisco, CA</span>
              </div>
              <div className="space-y-0.5 text-slate-650 mt-0.5 text-left">
                <p className="text-[3.8px] leading-[4.8px] pl-1.5 relative">
                  <span className="absolute left-0 text-slate-400">•</span>
                  Led team of 4 to design and implement a new API Gateway, reducing latency by 35%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "minimal" as const,
      title: "Minimal",
      description: "High-density clean layouts with tight margins and small font scaling. Great for detailed multi-year histories.",
      preview: (
        <div className="w-full aspect-210/297 bg-white text-slate-800 rounded-xl p-3 flex flex-col space-y-2 h-48 overflow-hidden select-none border border-slate-200 font-sans shadow-xs">
          {/* Header */}
          <div className="text-left">
            <h4 className="text-[7.5px] font-bold text-slate-900 tracking-tight leading-tight">Jonathan Doe</h4>
            <p className="text-[3.8px] text-slate-500 font-medium leading-none mt-0.5">
              jonathan.doe@email.com  |  (555) 019-2834  |  San Francisco, CA
            </p>
          </div>

          {/* Professional Summary */}
          <div className="space-y-0.5">
            <h5 className="text-[4px] font-bold uppercase tracking-wider text-slate-800 leading-none">Professional Summary</h5>
            <p className="text-[3.5px] leading-[4.5px] text-slate-650">
              Results-driven Software Engineer with 5+ years of experience building and deploying scalable web applications.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-0.5">
            <h5 className="text-[4px] font-bold uppercase tracking-wider text-slate-800 leading-none">Experience</h5>
            <div className="space-y-1">
              <div className="space-y-0.5">
                <div className="flex justify-between items-baseline leading-none">
                  <span className="text-[3.8px] font-bold text-slate-900">Senior Software Engineer</span>
                  <span className="text-[3.5px] text-slate-450 font-medium">2023 — Pres.</span>
                </div>
                <div className="flex justify-between items-baseline leading-none">
                  <span className="text-[3.8px] text-slate-600">TechCorp Inc. — San Francisco, CA</span>
                </div>
                <div className="space-y-0.5 text-slate-650 mt-0.5">
                  <p className="text-[3.5px] leading-[4.5px] pl-1.5 relative">
                    <span className="absolute left-0 text-slate-400">•</span>
                    Led API Gateway redesign, reducing latency by 35%.
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-baseline leading-none">
                  <span className="text-[3.8px] font-bold text-slate-900">Software Engineer</span>
                  <span className="text-[3.5px] text-slate-450 font-medium">2020 — 2023</span>
                </div>
                <div className="flex justify-between items-baseline leading-none">
                  <span className="text-[3.8px] text-slate-600">SoftSolutions LLC — Seattle, WA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // ── Step 1: Select Method ──
  if (step === "select_method") {
    return (
      <div className="h-full w-full bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-3xl w-full space-y-8 md:space-y-12 my-auto text-center">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Your Resume
            </h1>
            <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              How would you like to start building your professional resume today? Select an option below.
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Start from Scratch */}
            <button
              onClick={() => setStep("choose_template")}
              className="group text-left bg-card hover:bg-card/85 p-8 rounded-2xl border border-border/80 hover:border-primary/55 shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[220px] outline-hidden cursor-pointer"
            >
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <FileText className="size-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Start from Scratch
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose a design template and fill in your details step-by-step with interactive helper guidelines.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 opacity-75 group-hover:opacity-100 transition-opacity">
                <span>Select template</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Import from PDF */}
            <button
              onClick={() => setStep("import_pdf")}
              className="group text-left bg-card hover:bg-card/85 p-8 rounded-2xl border border-border/80 hover:border-primary/55 shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[220px] outline-hidden cursor-pointer"
            >
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-xl bg-violet-500/10 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300">
                  <Upload className="size-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Import from PDF
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Upload an existing PDF resume. Our AI parser will scan and extract all sections in seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-violet-500 mt-4 opacity-75 group-hover:opacity-100 transition-opacity">
                <span>Upload PDF file</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Exit Option */}
          <div className="flex justify-center pt-4">
            <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link to="/app">
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Choose Template ──
  if (step === "choose_template") {
    return (
      <div className="h-full w-full bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-4xl w-full space-y-8 md:space-y-12 my-auto">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Step 2: Choose Design</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Choose a Starting Template
            </h1>
            <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              Select a resume style to structure your professional achievements. You can switch templates at any time with a single click.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className="group relative text-left bg-card hover:bg-card/85 p-5 rounded-2xl border border-border/80 hover:border-primary/55 shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col space-y-4 outline-hidden cursor-pointer"
              >
                {/* Visual Preview */}
                {t.preview}

                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {t.title}
                    <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Go Back Option */}
          <div className="flex justify-center pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep("select_method")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Import PDF ──
  if (step === "import_pdf") {
    return (
      <div className="h-full w-full bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-2xl w-full space-y-8 md:space-y-12 my-auto text-center">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Import Resume PDF</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Upload Your Resume
            </h1>
            <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto">
              Our AI parser will analyze your document, extract personal info, skills, education, and experience, and import them.
            </p>
          </div>

          {/* Dropzone Container */}
          <div className="max-w-md mx-auto w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isImporting}
            />

            {isImporting ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-primary bg-primary/5 dark:bg-primary/5 shadow-inner animate-pulse min-h-[200px]">
                <Loader2 className="size-10 text-primary animate-spin mb-4" />
                <p className="text-base font-bold text-slate-900 dark:text-white">Analyzing your PDF...</p>
                <p className="text-xs text-muted-foreground mt-2 transition-all duration-500 animate-in fade-in zoom-in-95">
                  {loadingMessages[loadingStep]}
                </p>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`relative group cursor-pointer p-12 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] shadow-xs
                  ${isDragActive 
                    ? "border-primary bg-primary/5 dark:bg-primary/5 scale-[1.01] shadow-md" 
                    : "border-muted-foreground/20 hover:border-primary/55 hover:bg-slate-100/55 dark:hover:bg-slate-800/30"
                  }`}
              >
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300 mb-4">
                  <Upload className="size-8 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Drag & drop your PDF here, or <span className="underline">browse</span>
                </p>
                <p className="text-xs text-muted-foreground/75 mt-1.5">
                  Supports standard text-based PDF resumes (max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Go Back Option */}
          <div className="flex justify-center pt-4">
            <Button
              variant="ghost"
              disabled={isImporting}
              onClick={() => setStep("select_method")}
              className="gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <ArrowLeft className="size-4" />
              Choose Different Method
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


