import os
import json
from django.conf import settings
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Any, Optional

# --- Schemas ---

class ATSEvaluation(BaseModel):
    ats_score: int = Field(..., description="An integer from 0 to 100 representing how well the resume matches the JD.")
    keyword_match: List[str] = Field(..., description="List of important keywords from the JD that are present in the resume.")
    missing_keywords: List[str] = Field(..., description="List of important keywords from the JD that are MISSING from the resume.")
    suggestions: List[str] = Field(..., description="List of actionable, specific suggestions to improve the resume for this JD.")

class SkillRecommendation(BaseModel):
    recommended_skills: List[str] = Field(..., description="A list of strings representing the skills.")
    reasoning: str = Field(..., description="A brief explanation of why these skills are important for this role.")

class ParaphraseResult(BaseModel):
    suggestions: List[str] = Field(..., description="A list of 3 paraphrased versions of the bullet point.")

class JobDescriptionRecommendation(BaseModel):
    job_description: List[str] = Field(..., description="A list of 5 recommended job description bullet points.")

class SectionAnalysis(BaseModel):
    section_name: str = Field(..., description="Name of the section (e.g., Work Experience, Education, Skills, etc.)")
    score: int = Field(..., description="Score for this section from 0 to 100.")
    what_to_improve: str = Field(..., description="Specific advice on how to improve this section.")

class ResumeReview(BaseModel):
    overview: str = Field(..., description="A high-level summary of the resume's quality and alignment.")
    what_to_improve: Optional[str] = Field(None, description="General improvements for the entire resume.")
    section_analysis: List[SectionAnalysis] = Field(..., description="Detailed analysis for each key section of the resume.")

class SummaryRecommendation(BaseModel):
    summary: str = Field(..., description="A professional summary of 3-4 sentences tailored to the target role and job description.")

class TailoredExperience(BaseModel):
    index: int = Field(..., description="The index of the experience in the original experiences array.")
    original_bullets: List[str] = Field(..., description="List of original experience bullet points.")
    tailored_bullets: List[str] = Field(..., description="List of optimized, tailored experience bullet points.")
    reasoning: str = Field(..., description="Short explanation of what keywords or changes were introduced.")

class TailoredResume(BaseModel):
    tailored_summary: str = Field(..., description="Optimized professional summary tailored to the job description.")
    tailored_experiences: List[TailoredExperience] = Field(..., description="List of tailored experience objects, one for each experience containing bullet points.")
    skills_to_add: List[str] = Field(..., description="Suggested skills from the job description that are missing from the resume.")

class ParsedExperience(BaseModel):
    company_name: str = Field(default="", description="Name of the company/employer.")
    location: str = Field(default="", description="City and state/country of the job.")
    job_title: str = Field(default="", description="Job title/role.")
    date_from: str = Field(default="", description="Start date (e.g., 'Jan 2020').")
    date_to: str = Field(default="", description="End date (e.g., 'Present' or 'Dec 2022').")
    bullet_points: List[str] = Field(default_factory=list, description="List of achievements/duties as bullet points.")

class ParsedEducation(BaseModel):
    school: str = Field(default="", description="Name of the school/university.")
    location: str = Field(default="", description="City and state/country of the school.")
    school_type: str = Field(default="", description="Degree, certificate or program (e.g., 'B.S. in Computer Science').")
    date_from: str = Field(default="", description="Start date (e.g., '2016').")
    date_to: str = Field(default="", description="End date (e.g., '2020').")
    has_content: bool = Field(default=False, description="Set to True if there are bullet points/details.")
    content: str = Field(default="", description="Details, GPA, honors, or description of study.")

class ParsedResume(BaseModel):
    full_name: str = Field(default="", description="Candidate's full name.")
    email: str = Field(default="", description="Candidate's email address.")
    phone_number: str = Field(default="", description="Candidate's phone number.")
    location: str = Field(default="", description="Candidate's location (city, state/country).")
    has_skill: bool = Field(default=True, description="Should be True if skills are present.")
    skill_description: str = Field(default="", description="A short summary of skills.")
    skills: List[str] = Field(default_factory=list, description="List of skills.")
    has_experience: bool = Field(default=True, description="Should be True if experiences are present.")
    experiences: List[ParsedExperience] = Field(default_factory=list, description="List of work experiences.")
    has_education: bool = Field(default=True, description="Should be True if educations are present.")
    educations: List[ParsedEducation] = Field(default_factory=list, description="List of educations.")

# --- Core Agent ---


class AIAgent:
    """
    A reusable AI Agent that can be instantiated with its own system prompt and response schema.
    """
    def __init__(self, prompt_file: str, response_schema: Any, temperature: float = 0.3):
        self.prompt_file = prompt_file
        self.response_schema = response_schema
        self.temperature = temperature
        
        api_key = getattr(settings, 'GEMINI_API_KEY', os.environ.get('GEMINI_API_KEY'))
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")
            
        self.client = genai.Client(api_key=api_key)
        # Load model from environment or default to what was initially there
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(settings.BASE_DIR, 'generator', 'prompts', self.prompt_file)
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    def generate(self, **kwargs) -> dict:
        """
        Generates content using the agent's specific prompt and schema.
        """
        template = self._load_prompt()
        formatted_kwargs = {k: (v if v else "Not provided") for k, v in kwargs.items()}
        prompt = template.format(**formatted_kwargs)

        try:
            # Match the user's working configuration from AI Studio
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=self.response_schema,
                temperature=self.temperature,
            )

            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config
            )
            
            if not response.text:
                # If it's a thinking model, the text might be in a different place or the model might have failed
                print(f"AI Agent Error ({self.prompt_file}): Empty response. Candidates: {response.candidates}")
                raise ValueError("The AI model returned an empty response. This can happen if 'Thinking' takes too long or is blocked.")

            return json.loads(response.text)
        except Exception as e:
            print(f"AI Agent Error ({self.prompt_file}): {str(e)}")
            raise e

# --- Service Registry ---

class AIService:
    """
    Facade for all AI-powered features, delegating tasks to specific agents.
    """
    def __init__(self):
        self.ats_evaluator = AIAgent('ats_evaluator.txt', ATSEvaluation, temperature=0.2)
        self.skill_recommender = AIAgent('skill_recommender.txt', SkillRecommendation)
        self.paraphraser = AIAgent('paraphraser.txt', ParaphraseResult, temperature=0.4)
        self.job_description_recommender = AIAgent('job_description_recommender.txt', JobDescriptionRecommendation, temperature=0.5)
        self.reviewer = AIAgent('resume_reviewer.txt', ResumeReview, temperature=0.3)
        self.summary_recommender = AIAgent('summary_generator.txt', SummaryRecommendation, temperature=0.5)
        self.tailor_recommender = AIAgent('tailor_resume.txt', TailoredResume, temperature=0.3)
        self.resume_parser = AIAgent('resume_parser.txt', ParsedResume, temperature=0.1)


    def evaluate_ats(self, resume_data: dict, job_description: str) -> dict:
        return self.ats_evaluator.generate(
            resume_data=json.dumps(resume_data, indent=2),
            job_description=job_description
        )

    def recommend_skills(self, target_role: str, job_description: Optional[str]) -> dict:
        return self.skill_recommender.generate(
            target_role=target_role,
            job_description=job_description
        )

    def paraphrase_bullet(self, bullet_point: str, target_role: str, job_description: Optional[str], job_title: str = "") -> dict:
        return self.paraphraser.generate(
            bullet_point=bullet_point,
            target_role=target_role,
            job_title=job_title,
            job_description=job_description
        )

    def recommend_job_description(self, job_title: str, target_role: str, job_description: Optional[str]) -> dict:
        return self.job_description_recommender.generate(
            job_title=job_title,
            target_role=target_role,
            job_description=job_description
        )

    def review_resume(self, resume_data: dict, job_description: Optional[str], target_role: str) -> dict:
        return self.reviewer.generate(
            resume_data=json.dumps(resume_data, indent=2),
            job_description=job_description,
            target_role=target_role
        )

    def recommend_summary(self, resume_data: dict, target_role: str, job_description: Optional[str]) -> dict:
        return self.summary_recommender.generate(
            resume_data=json.dumps(resume_data, indent=2),
            target_role=target_role,
            job_description=job_description
        )

    def tailor_resume(self, resume_data: dict, target_role: str, job_description: str) -> dict:
        return self.tailor_recommender.generate(
            resume_data=json.dumps(resume_data, indent=2),
            target_role=target_role,
            job_description=job_description
        )

    def parse_resume_text(self, resume_text: str) -> dict:
        return self.resume_parser.generate(
            resume_text=resume_text
        )

