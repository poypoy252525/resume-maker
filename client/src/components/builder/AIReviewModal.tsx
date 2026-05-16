import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResumeStore } from "@/store/useResumeStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  FileText,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIReviewModal() {
  const { isReviewModalOpen, setReviewModalOpen, formData, loading } = useResumeStore();
  const feedback = formData.ai_feedback;
  const review = feedback?.review;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Dialog open={isReviewModalOpen} onOpenChange={setReviewModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">AI Resume Review</DialogTitle>
              <DialogDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Comprehensive analysis of your professional profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 pb-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative">
                   <div className="size-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                   <Sparkles className="size-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Analyzing your resume...</p>
                  <p className="text-sm text-muted-foreground max-w-xs">Our AI is reviewing every section to provide personalized feedback.</p>
                </div>
              </div>
            ) : !review ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <AlertCircle className="size-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">No analysis data available. Click "AI Analyze" to start.</p>
              </div>
            ) : (
              <>
                {/* Overview Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="size-5" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Overall Overview</h3>
                  </div>
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <FileText className="size-24" />
                    </div>
                    <p className="text-base leading-relaxed relative z-10">{review.overview}</p>
                    
                    {review.what_to_improve && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                         <div className="flex items-center gap-2 mb-2">
                           <Lightbulb className="size-4 text-warning" />
                           <span className="text-xs font-bold uppercase tracking-tighter text-warning/80">Main Areas for Improvement</span>
                         </div>
                         <p className="text-sm text-muted-foreground italic">{review.what_to_improve}</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* ATS Score and Stats - Only show if JD is provided */}
                {formData.job_description && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="md:col-span-1 border-none bg-muted/40 shadow-none rounded-2xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Target className="size-3" /> ATS Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center py-2">
                          <div className="relative size-24 flex items-center justify-center">
                             <svg className="size-full -rotate-90">
                               <circle 
                                  cx="48" cy="48" r="40" 
                                  fill="transparent" 
                                  stroke="currentColor" 
                                  strokeWidth="8"
                                  className="text-muted/20"
                               />
                               <circle 
                                  cx="48" cy="48" r="40" 
                                  fill="transparent" 
                                  stroke="currentColor" 
                                  strokeWidth="8"
                                  strokeDasharray={251.2}
                                  strokeDashoffset={251.2 - (251.2 * feedback.ats_score) / 100}
                                  strokeLinecap="round"
                                  className={cn("transition-all duration-1000", getScoreColor(feedback.ats_score))}
                               />
                             </svg>
                             <span className={cn("absolute text-2xl font-black", getScoreColor(feedback.ats_score))}>
                               {feedback.ats_score}%
                             </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-none bg-muted/40 shadow-none rounded-2xl">
                       <CardHeader className="pb-2">
                          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Keyword Match</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="space-y-2">
                             <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">Missing Keywords</span>
                                <Badge variant="outline" className="text-[10px] py-0">{feedback.missing_keywords.length}</Badge>
                             </div>
                             <div className="flex flex-wrap gap-1.5">
                                {feedback.missing_keywords.map((kw) => (
                                  <Badge key={kw} variant="secondary" className="bg-destructive/10 text-destructive border-none text-[10px] font-bold">
                                    {kw}
                                  </Badge>
                                ))}
                                {feedback.missing_keywords.length === 0 && (
                                  <span className="text-[10px] text-muted-foreground italic">No missing keywords found.</span>
                                )}
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                )}

                {/* Section Analysis */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="size-5" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Detailed Section Analysis</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {review.section_analysis.map((section, idx) => (
                      <div 
                        key={section.section_name} 
                        className="group bg-card hover:bg-muted/30 transition-all rounded-2xl border p-5 space-y-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <span className="text-xs font-bold">{idx + 1}</span>
                            </div>
                            <h4 className="font-bold text-sm">{section.section_name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className={cn("text-xs font-bold", getScoreColor(section.score))}>{section.score}/100</span>
                          </div>
                        </div>

                        <Progress value={section.score} className="h-1.5" />
                        
                        <div className="bg-muted/50 rounded-xl p-3">
                           <p className="text-xs leading-relaxed text-muted-foreground">
                             <span className="font-bold text-foreground block mb-1">How to improve:</span>
                             {section.what_to_improve}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
