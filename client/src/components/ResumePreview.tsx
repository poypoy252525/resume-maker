import type { ResumeData } from "@/api";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <Card className="w-full h-full bg-white text-slate-900 shadow-sm overflow-auto font-sans p-24 print:p-0 print:shadow-none print:w-full">
      <div className="w-full mx-auto space-y-7">
        {/* Header */}
        <header className="text-left space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight uppercase text-slate-900 truncate">
            {data.full_name}
          </h1>
          <div className="flex flex-col justify-start gap-y-1 text-sm text-slate-600 font-medium">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                {data.email}
              </div>
            )}
            {data.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                {data.phone_number}
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                {data.location}
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.skill_description && (
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5">
              Professional Summary
            </h2>
            <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">
              {data.skill_description}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experiences &&
          data.experiences.length > 0 &&
          data.experiences[0].company_name && (
            <section className="space-y-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[15px] text-slate-900 leading-none">
                        {exp.job_title || "Job Title"}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                        {exp.date_from} — {exp.date_to || "Present"}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] font-bold text-slate-700">
                        {exp.company_name}
                      </p>
                      <span className="text-[11px] italic text-slate-400">
                        {exp.location}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-[13px] space-y-1.5 text-slate-700 pt-1">
                      {exp.bullet_points.map(
                        (bp: string, j: number) =>
                          bp.trim() && (
                            <li key={j} className="pl-1">
                              {bp}
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Education */}
        {data.educations &&
          data.educations.length > 0 &&
          data.educations[0].school && (
            <section className="space-y-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5">
                Education
              </h2>
              <div className="space-y-4">
                {data.educations.map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[14px] text-slate-900">
                        {edu.school}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                        {edu.date_from} — {edu.date_to}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] text-slate-700 font-medium">
                        {edu.school_type}
                      </p>
                      <span className="text-[11px] italic text-slate-400">
                        {edu.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-12">
              <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-slate-700">
                {data.skills
                  .slice(0, Math.ceil(data.skills.length / 2))
                  .map((skill, i) => (
                    <li key={i} className="pl-1 text-slate-700">
                      {skill}
                    </li>
                  ))}
              </ul>
              <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-slate-700">
                {data.skills
                  .slice(Math.ceil(data.skills.length / 2))
                  .map((skill, i) => (
                    <li key={i} className="pl-1 text-slate-700">
                      {skill}
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </Card>
  );
}
