import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Camera, Trash2, UploadCloud } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/api";

interface PersonalInfoSectionProps {
  data: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const { handleRecommendSummary, isRecommendingSummary, uploadPhoto, deletePhoto } = useResumeStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (PNG, JPEG, WEBP).");
      return;
    }

    setIsUploading(true);
    try {
      await uploadPhoto(file);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this photo?")) {
      setIsUploading(true);
      try {
        await deletePhoto();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to delete photo.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!data.target_role?.trim()) {
      toast.warning("Please enter a Target Role first to help tailor the summary.");
      return;
    }

    try {
      const summary = await handleRecommendSummary();
      if (summary) {
        // Trigger onChange event to update parent state
        const event = {
          target: {
            name: "skill_description",
            value: summary,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(event);
        toast.success("Professional Summary generated!");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to generate summary.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-1">
      {/* Personal Info Layout: Photo Uploader & Text Fields */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Photo Upload Container */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 mx-auto md:mx-0">
          <Label className="text-sm font-semibold text-foreground/80 self-start md:self-center">Profile Photo</Label>
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "group relative size-32 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-sm",
              data.photo && "border-solid border-muted-foreground/10 bg-transparent"
            )}
          >
            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-primary animate-in fade-in duration-200">
                <Loader2 className="size-6 animate-spin" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Uploading...</span>
              </div>
            ) : data.photo ? (
              <>
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all scale-95 group-hover:scale-100 duration-300 hover:scale-110 shadow-lg"
                    title="Change Photo"
                  >
                    <Camera className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePhotoDelete}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white transition-all scale-95 group-hover:scale-100 duration-300 hover:scale-110 shadow-lg"
                    title="Remove Photo"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary transition-colors p-4 text-center">
                <div className="p-2 rounded-xl bg-background shadow-sm border border-muted-foreground/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                  <UploadCloud className="size-5" />
                </div>
                <span className="text-xs font-semibold">Upload Photo</span>
                <span className="text-[9px] text-muted-foreground/60 leading-none">Max size 2MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              value={data.full_name}
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={data.email}
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              placeholder="+1 (555) 000-0000"
              value={data.phone_number}
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="New York, NY"
              value={data.location}
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-2 pt-6 border-t border-muted-foreground/10">
        <div className="flex items-center justify-between">
          <Label htmlFor="skill_description" className="text-base font-semibold">
            Professional Summary
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isRecommendingSummary}
            className="h-8 gap-1.5 rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs font-semibold text-primary"
          >
            {isRecommendingSummary ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>{isRecommendingSummary ? "Generating..." : "Generate with AI"}</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Provide a brief paragraph summarizing your background and career goals.
        </p>
        <Textarea
          id="skill_description"
          name="skill_description"
          placeholder="e.g. A passionate software architect with 10+ years of experience..."
          className="min-h-32 rounded-xl resize-none shadow-inner bg-background/50 focus:bg-background transition-colors p-3 text-sm"
          value={data.skill_description}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
