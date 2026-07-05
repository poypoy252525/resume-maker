import type { ResumeData } from "@/api";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const template = data.template || "modern";
  const isClassic = template === "classic";
  const isMinimal = template === "minimal";

  const fontClass = isClassic ? "font-serif" : "font-sans";

  return (
    <Card
      className={cn(
        "w-full h-full bg-white text-slate-900 shadow-sm overflow-auto print:shadow-none print:w-full",
        fontClass,
        isMinimal ? "p-12 sm:p-16 print:p-0" : "p-16 sm:p-24 print:p-0"
      )}
    >
      <div className={cn("w-full mx-auto", isMinimal ? "space-y-5" : "space-y-7")}>
        {/* Header */}
        <header
          className={cn(
            "flex gap-6 items-start text-left",
            isMinimal && "gap-4",
            !data.photo && isClassic && "flex-col text-center space-y-2 justify-center items-center",
            !data.photo && !isClassic && "flex-col text-left space-y-3",
            data.photo && isClassic && "flex-row text-left space-y-0"
          )}
        >
          <div className="flex-1 min-w-0 space-y-2">
            <h1
              className={cn(
                "font-extrabold tracking-tight uppercase text-slate-900 truncate",
                isClassic ? "text-3xl font-bold font-serif" : "text-4xl",
                isMinimal ? "text-2xl normal-case" : ""
              )}
            >
              {data.full_name || "Your Name"}
            </h1>

            {isClassic ? (
              <div className={cn(
                "flex items-center gap-x-3 text-xs sm:text-sm text-slate-600 font-medium flex-wrap",
                !data.photo && "justify-center"
              )}>
                {data.email && <span>{data.email}</span>}
                {data.email && (data.phone_number || data.location) && <span>•</span>}
                {data.phone_number && <span>{data.phone_number}</span>}
                {data.phone_number && data.location && <span>•</span>}
                {data.location && <span>{data.location}</span>}
              </div>
            ) : isMinimal ? (
              <div className="flex justify-start items-center gap-x-2 text-xs text-slate-600 font-medium flex-wrap">
                {data.email && <span>{data.email}</span>}
                {data.email && (data.phone_number || data.location) && <span className="opacity-55">|</span>}
                {data.phone_number && <span>{data.phone_number}</span>}
                {data.phone_number && data.location && <span className="opacity-55">|</span>}
                {data.location && <span>{data.location}</span>}
              </div>
            ) : (
              // Modern
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
            )}
          </div>
          {data.photo && (
            <img
              src={data.photo}
              alt={data.full_name || "Profile"}
              className={cn(
                "w-24 h-24 object-cover border border-slate-200 shadow-sm flex-shrink-0",
                isClassic ? "rounded-full" : "rounded-xl"
              )}
            />
          )}
        </header>

        {/* Professional Summary */}
        {data.skill_description && (
          <section className={isMinimal ? "space-y-1.5" : "space-y-3"}>
            <h2
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5",
                isClassic && "text-center text-slate-900 border-none pb-0.5 tracking-[0.20em] text-[12px]",
                isMinimal && "text-left text-slate-800 border-none pb-0.5 tracking-[0.15em]"
              )}
            >
              Professional Summary
            </h2>
            <p
              className={cn(
                "leading-relaxed text-slate-700 whitespace-pre-wrap",
                isMinimal ? "text-[12px]" : "text-[13px]"
              )}
            >
              {data.skill_description}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experiences &&
          data.experiences.length > 0 &&
          data.experiences[0].company_name && (
            <section className={isMinimal ? "space-y-4" : "space-y-6"}>
              <h2
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5",
                  isClassic && "text-center text-slate-900 border-none pb-0.5 tracking-[0.20em] text-[12px]",
                  isMinimal && "text-left text-slate-800 border-none pb-0.5 tracking-[0.15em]"
                )}
              >
                Professional Experience
              </h2>
              <div className={isMinimal ? "space-y-4" : "space-y-6"}>
                {data.experiences.map((exp, i) => (
                  <div key={i} className={isMinimal ? "space-y-1" : "space-y-2"}>
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={cn(
                          "font-bold text-slate-900 leading-none",
                          isMinimal ? "text-[13px]" : "text-[15px]"
                        )}
                      >
                        {exp.job_title || "Job Title"}
                      </h3>
                      <span
                        className={cn(
                          "font-medium text-slate-500 tabular-nums",
                          isMinimal ? "text-[10px]" : "text-[11px]"
                        )}
                      >
                        {exp.date_from} — {exp.date_to || "Present"}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p
                        className={cn(
                          "font-bold text-slate-700",
                          isMinimal ? "text-[12px]" : "text-[13px]"
                        )}
                      >
                        {exp.company_name}
                      </p>
                      <span className={cn(
                        "italic text-slate-400",
                        isMinimal ? "text-[10px]" : "text-[11px]"
                      )}>
                        {exp.location}
                      </span>
                    </div>
                    <ul
                      className={cn(
                        "list-disc list-outside ml-4 space-y-1.5 text-slate-700 pt-1",
                        isMinimal ? "text-[12px] ml-3.5 space-y-1" : "text-[13px]"
                      )}
                    >
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
            <section className={isMinimal ? "space-y-3" : "space-y-5"}>
              <h2
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5",
                  isClassic && "text-center text-slate-900 border-none pb-0.5 tracking-[0.20em] text-[12px]",
                  isMinimal && "text-left text-slate-800 border-none pb-0.5 tracking-[0.15em]"
                )}
              >
                Education
              </h2>
              <div className={isMinimal ? "space-y-3" : "space-y-4"}>
                {data.educations.map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={cn(
                          "font-bold text-slate-900",
                          isMinimal ? "text-[13px]" : "text-[14px]"
                        )}
                      >
                        {edu.school}
                      </h3>
                      <span
                        className={cn(
                          "font-medium text-slate-500 tabular-nums",
                          isMinimal ? "text-[10px]" : "text-[11px]"
                        )}
                      >
                        {edu.date_from} — {edu.date_to}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p
                        className={cn(
                          "text-slate-700 font-medium",
                          isMinimal ? "text-[12px]" : "text-[13px]"
                        )}
                      >
                        {edu.school_type}
                      </p>
                      <span className={cn(
                        "italic text-slate-400",
                        isMinimal ? "text-[10px]" : "text-[11px]"
                      )}>
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
          <section className={isMinimal ? "space-y-2" : "space-y-3"}>
            <h2
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-1.5",
                isClassic && "text-center text-slate-900 border-none pb-0.5 tracking-[0.20em] text-[12px]",
                isMinimal && "text-left text-slate-800 border-none pb-0.5 tracking-[0.15em]"
              )}
            >
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-12">
              <ul
                className={cn(
                  "list-disc list-outside ml-4 space-y-1 text-slate-700",
                  isMinimal ? "text-[12px] ml-3.5 space-y-0.5" : "text-[13px]"
                )}
              >
                {data.skills
                  .slice(0, Math.ceil(data.skills.length / 2))
                  .map((skill, i) => (
                    <li key={i} className="pl-1 text-slate-700">
                      {skill}
                    </li>
                  ))}
              </ul>
              <ul
                className={cn(
                  "list-disc list-outside ml-4 space-y-1 text-slate-700",
                  isMinimal ? "text-[12px] ml-3.5 space-y-0.5" : "text-[13px]"
                )}
              >
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
