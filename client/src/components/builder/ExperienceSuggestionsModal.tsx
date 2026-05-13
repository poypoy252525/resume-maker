import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Wand2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceSuggestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: string[];
  jobTitle: string;
  onAddSuggestion: (suggestion: string) => void;
  addedBullets: string[];
}

export default function ExperienceSuggestionsModal({
  open,
  onOpenChange,
  suggestions,
  jobTitle,
  onAddSuggestion,
  addedBullets,
}: ExperienceSuggestionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            AI Role Suggestions
          </DialogTitle>
          <DialogDescription className="text-xs">
            Recommended responsibilities for <span className="font-bold text-foreground">{jobTitle || "this role"}</span>.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3 py-4">
            {suggestions.map((suggestion, i) => {
              const isAlreadyAdded = addedBullets.includes(suggestion);
              return (
                <div
                  key={i}
                  className={cn(
                    "group relative p-3 rounded-xl border border-border/50 bg-background transition-all",
                    isAlreadyAdded ? "opacity-60 bg-muted/30" : "hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <p className="text-xs leading-relaxed pr-8">
                    {suggestion}
                  </p>
                  {!isAlreadyAdded && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onAddSuggestion(suggestion)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {isAlreadyAdded && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
