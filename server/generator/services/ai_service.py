import os
import json
from django.conf import settings
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# Define schemas for structured output
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


class AIService:
    def __init__(self):
        # Initialize Gemini client
        # Note: client automatically looks for GEMINI_API_KEY in environment variables.
        api_key = getattr(settings, 'GEMINI_API_KEY', os.environ.get('GEMINI_API_KEY'))
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in settings or environment variables.")
        
        self.client = genai.Client(api_key=api_key)
        self.model_name = 'gemma-4-31b-it' # Using Flash for speed and cost

    def _load_prompt(self, filename: str) -> str:
        prompt_path = os.path.join(settings.BASE_DIR, 'generator', 'prompts', filename)
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    def evaluate_ats(self, resume_data: dict, job_description: str) -> dict:
        """
        Evaluates the resume against a job description and returns score + suggestions.
        """
        template = self._load_prompt('ats_evaluator.txt')
        prompt = template.format(
            resume_data=json.dumps(resume_data, indent=2),
            job_description=job_description
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ATSEvaluation,
                    temperature=0.2 # Lower temperature for more deterministic evaluation
                )
            )
            return json.loads(response.text)
        except Exception as e:
            # Fallback/Error handling
            return {
                "ats_score": 0,
                "keyword_match": [],
                "missing_keywords": [],
                "suggestions": [f"Error communicating with AI: {str(e)}"]
            }

    def recommend_skills(self, target_role: str, job_description: str) -> dict:
        """
        Recommends skills based on the role and JD.
        """
        template = self._load_prompt('skill_recommender.txt')
        prompt = template.format(
            target_role=target_role,
            job_description=job_description
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=SkillRecommendation,
                    temperature=0.3
                )
            )
            return json.loads(response.text)
        except Exception as e:
            return {
                "recommended_skills": [],
                "reasoning": f"Error: {str(e)}"
            }

    def paraphrase_bullet(self, bullet_point: str, target_role: str, job_description: str) -> dict:
        """
        Paraphrases a single bullet point for ATS optimization.
        """
        template = self._load_prompt('paraphraser.txt')
        prompt = template.format(
            bullet_point=bullet_point,
            target_role=target_role,
            job_description=job_description
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ParaphraseResult,
                    temperature=0.4
                )
            )
            return json.loads(response.text)
        except Exception as e:
            return {
                "suggestions": [
                    f"Error: {str(e)}",
                    "Try again later.",
                    "Optimization failed."
                ]
            }
