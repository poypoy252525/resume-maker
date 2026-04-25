import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User, Wand2 } from "lucide-react";

export default function AIAssistantPanel() {
  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-900/50 border-r backdrop-blur-xl">

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-6 space-y-6">
          {/* AI Message */}
          <div className="flex gap-3 items-start group">
            <div className="size-8 rounded-xl bg-linear-to-tr from-primary to-primary/60 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="size-4 text-white" />
            </div>
            <div className="bg-background/80 rounded-2xl rounded-tl-none p-3 border border-primary/10 shadow-sm text-sm max-w-[85%] leading-relaxed">
              I've analyzed your current resume. I can help you optimize your <strong>Professional Summary</strong> to match the job description better. Would you like some suggestions?
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2.5 pl-11">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Suggested Improvements
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: <Wand2 className="size-3" />, label: "Optimize for ATS" },
                { icon: <Sparkles className="size-3" />, label: "Stronger Action Verbs" },
                { icon: <Bot className="size-3" />, label: "Generate Summary" },
              ].map((action, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  size="sm" 
                  className="justify-start gap-2 h-9 text-xs bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-primary">{action.icon}</span>
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-3 items-start justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 shadow-md text-sm max-w-[85%] leading-relaxed">
              Yes, please show me how to improve my summary for a Senior Software Engineer role.
            </div>
            <div className="size-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600">
              <User className="size-4 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/80 backdrop-blur-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
          <Input 
            placeholder="Type your message..." 
            className="relative pr-10 rounded-xl bg-background border-primary/10 focus-visible:ring-primary/20 h-11"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 size-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
