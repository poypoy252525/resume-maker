import React from "react";
import type { LucideIcon } from "lucide-react";

interface SectionWrapperProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function SectionWrapper({ title, description, icon: Icon, children }: SectionWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
