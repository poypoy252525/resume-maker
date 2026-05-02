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

class AchievementRecommendation(BaseModel):
    achievements: List[str] = Field(..., description="A list of 5 recommended achievement bullet points.")

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
        self.model_name = os.getenv('GEMINI_MODEL', 'gemma-4-31b-it')

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(settings.BASE_DIR, 'generator', 'prompts', self.prompt_file)
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    def generate(self, **kwargs) -> dict:
        """
        Generates content using the agent's specific prompt and schema.
        """
        template = self._load_prompt()
        
        # Ensure all expected variables are present in kwargs, default to "Not provided"
        # This is a safety measure to allow optional fields like job_description
        formatted_kwargs = {k: (v if v else "Not provided") for k, v in kwargs.items()}
        
        prompt = template.format(**formatted_kwargs)

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=self.response_schema,
                    temperature=self.temperature
                )
            )
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
        self.achievement_recommender = AIAgent('achievement_recommender.txt', AchievementRecommendation, temperature=0.5)

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

    def recommend_achievements(self, job_title: str, target_role: str, job_description: Optional[str]) -> dict:
        return self.achievement_recommender.generate(
            job_title=job_title,
            target_role=target_role,
            job_description=job_description
        )
