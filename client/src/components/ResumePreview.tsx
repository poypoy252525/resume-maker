import type { ResumeData } from "@/api";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <Card className="w-full h-full bg-white text-slate-900 shadow-sm overflow-auto font-sans p-8 print:p-0 print:shadow-none print:w-full">
      <div className="max-w-200 mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            {data.full_name}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            {data.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {data.email}
              </div>
            )}
            {data.phone_number && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {data.phone_number}
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {data.location}
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.skill_description && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {data.skill_description}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1">
              Skills
            </h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 list-disc list-outside ml-4 text-xs text-slate-800 pt-1">
              {data.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience */}
        {data.experiences && data.experiences.length > 0 && data.experiences[0].company_name && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1">
              Professional Experience
            </h2>
            {data.experiences.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{exp.job_title || "Job Title"}</h3>
                    <p className="text-sm italic text-slate-700">{exp.company_name}</p>
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    {exp.date_from} — {exp.date_to || "Present"}
                    <p>{exp.location}</p>
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 text-xs space-y-1 text-slate-800">
                  {exp.bullet_points.map((bp: string, j: number) => (
                    bp.trim() && <li key={j}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.educations && data.educations.length > 0 && data.educations[0].school && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1">
              Education
            </h2>
            {data.educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">{edu.school}</h3>
                  <p className="text-sm text-slate-700">{edu.school_type}</p>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  {edu.date_from} — {edu.date_to}
                  <p>{edu.location}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </Card>
  );
}
