import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Bot, 
  Target, 
  Settings, 
  Lightbulb, 
  Wand2, 
  ClipboardCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import type { ResumeData } from "@/api";

interface AIAssistantPanelProps {
  formData: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSkillsChange: (skills: string[]) => void;
  onAnalyze: () => void;
  onParaphrase: (bullet: string) => Promise<string[] | null>;
  onUpdateBullet: (expIndex: number, bulletIndex: number, newValue: string) => void;
  onRecommendAchievements: (jobTitle: string) => Promise<string[] | null>;
  onAddBullet: (expIndex: number, bullet: string) => void;
  loading: boolean;
  step: number;
  activeExperienceIndex: number | null;
  activeBulletIndex: number | null;
}

export default function AIAssistantPanel({
  formData,
  onChange,
  onSkillsChange,
  onAnalyze,
  onParaphrase,
  onUpdateBullet,
  onRecommendAchievements,
  onAddBullet,
  loading,
  step,
  activeExperienceIndex,
  activeBulletIndex,
}: AIAssistantPanelProps) {
  const [paraphraseResults, setParaphraseResults] = useState<{ bullet: string; suggestions: string[]; expIdx: number; bpIdx: number } | null>(null);
  const [achievementIdeas, setAchievementIdeas] = useState<{ jobTitle: string; achievements: string[]; expIdx: number } | null>(null);
  const [activeTab, setActiveTab] = useState("insights");
  
  const feedback = formData.ai_feedback;

  const handleAddRecommendedSkill = (skill: string) => {
    const currentSkills = formData.skills || [];
    if (!currentSkills.includes(skill)) {
      onSkillsChange([...currentSkills, skill]);
    }
  };

  const handleParaphraseRequest = async (bullet: string, expIdx: number, bpIdx: number) => {
    if (!bullet.trim()) return;
    const suggestions = await onParaphrase(bullet);
    if (suggestions) {
      setParaphraseResults({ bullet, suggestions, expIdx, bpIdx });
    }
  };

  const applyParaphrase = (optimized: string) => {
    if (paraphraseResults) {
      onUpdateBullet(paraphraseResults.expIdx, paraphraseResults.bpIdx, optimized);
      setParaphraseResults(null);
    }
  };

  const handleGetAchievementIdeas = async (jobTitle: string, expIdx: number) => {
    if (!jobTitle.trim()) return;
    const achievements = await onRecommendAchievements(jobTitle);
    if (achievements) {
      setAchievementIdeas({ jobTitle, achievements, expIdx });
    }
  };

  const handleAddAchievement = (achievement: string) => {
    if (achievementIdeas) {
      onAddBullet(achievementIdeas.expIdx, achievement);
      // Remove the added one from local state to avoid duplicates
      setAchievementIdeas({
        ...achievementIdeas,
        achievements: achievementIdeas.achievements.filter(a => a !== achievement)
      });
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-900/50 border-r backdrop-blur-xl">
      <header className="p-4 border-b flex items-center justify-between bg-background/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-linear-to-tr from-primary to-primary/60 flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">AI Assistant</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Step {step} Insights</p>
          </div>
        </div>
        {feedback && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">ATS Match</span>
            <span className={`text-sm font-black ${feedback.ats_score >= 80 ? 'text-green-600' : feedback.ats_score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
              {feedback.ats_score}%
            </span>
          </div>
        )}
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2 rounded-xl h-9 p-1 bg-muted/50">
            <TabsTrigger value="insights" className="text-[11px] font-bold rounded-lg data-[state=active]:shadow-sm">
              <Lightbulb className="size-3 mr-1.5" /> Insights
            </TabsTrigger>
            <TabsTrigger value="setup" className="text-[11px] font-bold rounded-lg data-[state=active]:shadow-sm">
              <Settings className="size-3 mr-1.5" /> Setup
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="insights" className="flex-1 min-h-0 m-0 focus-visible:outline-none">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Analysis Trigger if no feedback */}
              {!feedback && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center space-y-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="size-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold">Ready to Optimize?</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed px-2">
                      Paste your target job description in the <b>Setup</b> tab to unlock personalized AI suggestions.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("setup")}
                    className="h-8 text-[10px] font-bold rounded-lg border-primary/20 hover:bg-primary/5"
                  >
                    Go to Setup <ArrowRight className="size-3 ml-1.5" />
                  </Button>
                </div>
              )}

              {/* Contextual Content based on Step */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <Target className="size-3.5 text-primary" /> Personal Branding
                  </h4>
                  <ul className="space-y-2 text-[11px] text-muted-foreground">
                    <li className="flex gap-2">
                      <div className="size-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                      Ensure your LinkedIn profile URL is professional and clean.
                    </li>
                    <li className="flex gap-2">
                      <div className="size-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                      Use a professional email address (e.g., firstname.lastname@email.com).
                    </li>
                  </ul>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  {/* Real-time Optimizer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold flex items-center gap-2">
                        <Wand2 className="size-3.5 text-primary" /> Bullet Point Optimizer
                      </h4>
                      {loading && paraphraseResults && <Zap className="size-3 text-primary animate-pulse" />}
                    </div>
                    
                    {activeExperienceIndex !== null && activeBulletIndex !== null ? (
                      <div className="space-y-3">
                        <div className="p-2.5 rounded-xl bg-muted/30 border border-dashed text-[10px] text-muted-foreground italic line-clamp-2">
                          "{formData.experiences[activeExperienceIndex].bullet_points[activeBulletIndex] || "Focused bullet point..."}"
                        </div>
                        
                        <Button 
                          onClick={() => {
                            const bullet = formData.experiences[activeExperienceIndex].bullet_points[activeBulletIndex];
                            handleParaphraseRequest(bullet, activeExperienceIndex, activeBulletIndex);
                          }}
                          disabled={loading || !formData.experiences[activeExperienceIndex].bullet_points[activeBulletIndex].trim()}
                          className="w-full h-8 text-[10px] rounded-xl shadow-sm"
                        >
                          {loading ? "Optimizing..." : "Optimize This Bullet"}
                        </Button>

                        {paraphraseResults && paraphraseResults.expIdx === activeExperienceIndex && paraphraseResults.bpIdx === activeBulletIndex && (
                          <div className="space-y-2 bg-primary/5 border border-primary/20 rounded-xl p-3 animate-in zoom-in-95">
                            <span className="text-[10px] font-bold text-primary uppercase">Suggestions</span>
                            <div className="space-y-2">
                              {paraphraseResults.suggestions.map((s, i) => (
                                <div 
                                  key={i} 
                                  className="text-[10px] bg-background border rounded-lg p-2 hover:border-primary/50 cursor-pointer transition-colors group"
                                  onClick={() => applyParaphrase(s)}
                                >
                                  <p className="leading-tight">{s}</p>
                                  <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-bold text-primary uppercase">Click to apply</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-xl p-4 border border-dashed text-center">
                        <Bot className="size-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-[10px] text-muted-foreground italic">
                          Click on a bullet point in the editor to see optimization suggestions.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Achievement Ideas Section */}
                  <div className="space-y-4 pt-4 border-t border-dashed">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold flex items-center gap-2">
                        <Plus className="size-3.5 text-primary" /> Achievement Ideas
                      </h4>
                      {loading && achievementIdeas && <Zap className="size-3 text-primary animate-pulse" />}
                    </div>

                    {activeExperienceIndex !== null ? (
                      <div className="space-y-3">
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          Suggestions for <span className="font-bold text-foreground truncate max-w-[150px] inline-block align-bottom">{formData.experiences[activeExperienceIndex].job_title || "your role"}</span>.
                        </p>
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleGetAchievementIdeas(formData.experiences[activeExperienceIndex].job_title, activeExperienceIndex)}
                          disabled={loading || !formData.experiences[activeExperienceIndex].job_title.trim()}
                          className="w-full h-8 text-[10px] rounded-xl border-primary/20 hover:bg-primary/5"
                        >
                          Generate Achievement Ideas
                        </Button>

                        {achievementIdeas && achievementIdeas.expIdx === activeExperienceIndex && (
                          <div className="space-y-2 pt-2">
                            {achievementIdeas.achievements.map((a, i) => (
                              <div 
                                key={i} 
                                className="text-[10px] bg-background border rounded-lg p-2.5 hover:border-primary/50 cursor-pointer transition-all group relative"
                                onClick={() => handleAddAchievement(a)}
                              >
                                <p className="leading-tight pr-4">{a}</p>
                                <Plus className="size-3 absolute right-2 top-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-xl p-4 border border-dashed text-center">
                        <Lightbulb className="size-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-[10px] text-muted-foreground italic">
                          Select an experience card to get tailored achievement ideas.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && feedback && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <Plus className="size-3.5 text-primary" /> Recommended Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {feedback.recommended_skills.map((skill, i) => {
                      const isAdded = (formData.skills || []).includes(skill);
                      return (
                        <Badge
                          key={i}
                          variant={isAdded ? "secondary" : "outline"}
                          onClick={() => !isAdded && handleAddRecommendedSkill(skill)}
                          className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-all gap-1 ${
                            isAdded 
                              ? 'bg-muted text-muted-foreground cursor-default opacity-60' 
                              : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30 border-dashed'
                          }`}
                        >
                          {skill}
                          {!isAdded && <Plus className="size-2 text-primary/60" />}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* General Feedback Section (Always at bottom of insights) */}
              {feedback && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <ClipboardCheck className="size-3.5 text-primary" /> ATS Scorecard
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border bg-background/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle className="size-3" />
                        <span className="text-[9px] font-bold uppercase">Matching</span>
                      </div>
                      <p className="text-xl font-bold">{feedback.keyword_match.length}</p>
                    </div>
                    <div className="p-3 rounded-xl border bg-background/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <AlertCircle className="size-3" />
                        <span className="text-[9px] font-bold uppercase">Missing</span>
                      </div>
                      <p className="text-xl font-bold">{feedback.missing_keywords.length}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground">Top Suggestions</h5>
                    <ul className="space-y-2 text-[10px] text-muted-foreground">
                      {feedback.suggestions.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex gap-2 p-2 bg-muted/30 rounded-lg">
                          <span className="text-primary font-bold"># {i+1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="setup" className="flex-1 min-h-0 m-0 focus-visible:outline-none">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target_role" className="text-[10px] font-bold uppercase text-muted-foreground">Target Role</Label>
                  <Input
                    id="target_role"
                    name="target_role"
                    value={formData.target_role || ""}
                    onChange={onChange}
                    placeholder="e.g. Senior Product Designer"
                    className="rounded-xl text-xs h-10 border-muted-foreground/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_description" className="text-[10px] font-bold uppercase text-muted-foreground">Job Description</Label>
                  <Textarea
                    id="job_description"
                    name="job_description"
                    value={formData.job_description || ""}
                    onChange={onChange}
                    placeholder="Paste the job description here..."
                    className="min-h-48 rounded-2xl text-xs resize-none border-muted-foreground/20 focus:border-primary/50 p-4"
                  />
                </div>
                <Button
                  onClick={onAnalyze}
                  disabled={loading || !formData.job_description}
                  className="w-full gap-2 rounded-xl text-xs h-11 shadow-lg shadow-primary/20 font-bold"
                >
                  {loading ? (
                    <Zap className="size-4 animate-pulse" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {loading ? "Analyzing..." : "Analyze ATS Match"}
                </Button>
              </div>

              {feedback && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-dashed text-center space-y-2">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Last analyzed with {feedback.keyword_match.length} matching keywords and {feedback.missing_keywords.length} missing.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
