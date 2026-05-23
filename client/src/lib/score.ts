import type { ResumeData } from "@/api";

export function calculateResumeScore(data: ResumeData): number {
  if (!data) return 0;

  // 1. If AI feedback with ATS score is available AND a job description is present, prioritize it
  const aiFeedback = data.ai_feedback;
  if (aiFeedback && data.job_description?.trim()) {
    if (aiFeedback.ats_score !== undefined && aiFeedback.ats_score !== null) {
      return aiFeedback.ats_score;
    }
    const review = aiFeedback.review;
    if (review && review.section_analysis && review.section_analysis.length > 0) {
      const scores = review.section_analysis.map((s) => s.score);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.round(avg);
    }
  }

  // 2. Otherwise, calculate completeness score (max 100)
  let score = 0;

  // Profile Info: up to 20 pts (5 pts each)
  if (data.full_name?.trim()) score += 5;
  if (data.email?.trim()) score += 5;
  if (data.phone_number?.trim()) score += 5;
  if (data.location?.trim()) score += 5;

  // Work Experience: up to 30 pts (10 pts per experience up to 3)
  const experiences = data.experiences || [];
  let validExps = 0;
  for (const exp of experiences) {
    if (exp.company_name?.trim() || exp.job_title?.trim()) {
      validExps++;
    }
  }
  score += Math.min(validExps * 10, 30);

  // Skills: up to 25 pts (5 pts per skill up to 5)
  const skills = data.skills || [];
  const validSkills = skills.filter((s) => s?.trim());
  score += Math.min(validSkills.length * 5, 25);

  // Education: up to 15 pts (7.5 pts per education up to 2)
  const educations = data.educations || [];
  let validEdus = 0;
  for (const edu of educations) {
    if (edu.school?.trim()) {
      validEdus++;
    }
  }
  score += Math.min(Math.floor(validEdus * 7.5), 15);

  // Target Role & Job Description: up to 10 pts (5 pts each)
  if (data.target_role?.trim()) score += 5;
  if (data.job_description?.trim()) score += 5;

  return score;
}
