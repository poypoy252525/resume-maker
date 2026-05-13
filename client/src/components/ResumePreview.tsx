import type { ResumeData } from "@/api";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <Card className="w-full h-full bg-white text-slate-900 shadow-sm overflow-auto font-sans p-20 print:p-0 print:shadow-none print:w-full">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <header className="text-left space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight uppercase text-slate-900 leading-none">
            {data.full_name}
          </h1>
          <div className="flex flex-wrap justify-start gap-x-5 gap-y-2 text-sm text-slate-600 font-medium">
            {data.email && (
              <div className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <Mail className="w-3.5 h-3.5" />
                {data.email}
              </div>
            )}
            {data.phone_number && (
              <div className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <Phone className="w-3.5 h-3.5" />
                {data.phone_number}
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <MapPin className="w-3.5 h-3.5" />
                {data.location}
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.skill_description && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border-b-2 border-slate-100 pb-2">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {data.skill_description}
            </p>
          </section>
        )}



        {/* Experience */}
        {data.experiences && data.experiences.length > 0 && data.experiences[0].company_name && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border-b-2 border-slate-100 pb-2">
              Professional Experience
            </h2>
            {data.experiences.map((exp, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-[15px] text-slate-900">{exp.job_title || "Job Title"}</h3>
                    <p className="text-sm font-semibold text-primary/80">{exp.company_name}</p>
                  </div>
                  <div className="text-xs font-medium text-slate-500 text-right">
                    <div className="tabular-nums">{exp.date_from} — {exp.date_to || "Present"}</div>
                    <div className="italic">{exp.location}</div>
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 text-[13px] space-y-2 text-slate-700">
                  {exp.bullet_points.map((bp: string, j: number) => (
                    bp.trim() && <li key={j} className="pl-1">{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.educations && data.educations.length > 0 && data.educations[0].school && (
          <section className="space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border-b-2 border-slate-100 pb-2">
              Education
            </h2>
            {data.educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-slate-900">{edu.school}</h3>
                  <p className="text-sm font-semibold text-primary/80">{edu.school_type}</p>
                </div>
                <div className="text-xs font-medium text-slate-500 text-right">
                  <div className="tabular-nums">{edu.date_from} — {edu.date_to}</div>
                  <div className="italic">{edu.location}</div>
                </div>
              </div>
            ))}
          </section>
        )}
        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border-b-2 border-slate-100 pb-2">
              Skills
            </h2>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              <span className="font-bold">Technical Skills:</span> {data.skills.join(", ")}
            </p>
          </section>
        )}
      </div>
    </Card>
  );
}
