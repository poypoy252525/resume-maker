import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeData } from "@/api";

interface PersonalInfoSectionProps {
  data: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="John Doe"
            value={data.full_name}
            onChange={onChange}
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
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label htmlFor="skill_description" className="text-base font-semibold">
          Professional Summary
        </Label>
        <p className="text-sm text-muted-foreground">
          Provide a brief paragraph summarizing your background and career goals.
        </p>
        <Textarea
          id="skill_description"
          name="skill_description"
          placeholder="e.g. A passionate software architect with 10+ years of experience..."
          className="min-h-32 rounded-xl resize-none shadow-inner bg-background/50"
          value={data.skill_description}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
