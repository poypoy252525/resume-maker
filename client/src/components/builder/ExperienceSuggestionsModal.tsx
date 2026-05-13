import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, RefreshCw, Wand2 } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface ExperienceSuggestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: string[];
  jobTitle: string;
  onAddSuggestions: (suggestions: string[]) => void;
  addedBullets: string[];
  onRefresh: () => void;
  loading?: boolean;
}

export default function ExperienceSuggestionsModal({
  open,
  onOpenChange,
  suggestions,
  jobTitle,
  onAddSuggestions,
  addedBullets,
  onRefresh,
  loading = false,
}: ExperienceSuggestionsModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Reset selection when modal is closed (Adjusting state during render is the recommended pattern)
  if (!open && selectedItems.length > 0) {
    setSelectedItems([]);
  }

  const toggleSelection = (suggestion: string) => {
    setSelectedItems((prev) =>
      prev.includes(suggestion)
        ? prev.filter((s) => s !== suggestion)
        : [...prev, suggestion],
    );
  };

  const filteredSuggestions = suggestions.filter(
    (s) => !addedBullets.includes(s),
  );

  const handleAddSelected = () => {
    if (selectedItems.length > 0) {
      onAddSuggestions(selectedItems);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl flex flex-col max-h-[80vh] p-0 overflow-hidden border-none shadow-2xl bg-background gap-0!">
        {/* Header Section */}
        <div className="p-6 border-b shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">AI Role Suggestions</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Select responsibilities for{" "}
            <span className="font-bold text-foreground">{jobTitle}</span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6">
          <div className="space-y-3 py-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full p-4 rounded-xl border border-border/30 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))
            ) : filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, i) => {
                const isSelected = selectedItems.includes(suggestion);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSelection(suggestion)}
                    className={cn(
                      "w-full text-left relative p-4 rounded-xl border transition-all duration-200 group",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border/50 bg-background hover:border-primary/30 hover:bg-muted/30",
                    )}
                  >
                    <p className="text-xs leading-relaxed pr-10">
                      {suggestion}
                    </p>
                    <div
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center size-5 rounded-full border transition-all",
                        isSelected
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "border-muted-foreground/30 group-hover:border-primary/50",
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-semibold">No more suggestions</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                  className="mt-4 rounded-xl"
                >
                  <RefreshCw
                    className={cn("w-3 h-3 mr-2", loading && "animate-spin")}
                  />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 bg-muted/50 border-t shrink-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  Selected
                </span>
                <span className="text-xs font-bold">
                  {selectedItems.length} items
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <RefreshCw
                  className={cn("w-3 h-3 mr-2", loading && "animate-spin")}
                />
                {loading ? "Generating..." : "Refresh"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddSelected}
                disabled={selectedItems.length === 0}
                className="flex-2"
              >
                Add to Experience
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
