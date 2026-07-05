from django.conf import settings
from django.db import models
import uuid

from .validators import validate_resume_data

class Resume(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        COMPLETED = 'COMPLETED', 'Completed'
        PROCESSING = 'PROCESSING', 'Processing'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    
    title = models.CharField(max_length=255, default="Untitled Resume")
    
    # Store the full state of the resume builder
    data = models.JSONField(default=dict, blank=True, validators=[validate_resume_data])
    
    # Final generated asset
    file = models.FileField(upload_to='resumes/', null=True, blank=True)
    photo = models.ImageField(upload_to='photos/', null=True, blank=True)

    
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.DRAFT
    )
    
    score = models.IntegerField(default=0)
    is_favorite = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def calculate_score(self):
        data = self.data
        if not isinstance(data, dict):
            return 0

        # 1. If AI feedback with ATS score is available AND a job description is present, prioritize it
        ai_feedback = data.get('ai_feedback')
        job_description = data.get('job_description', '') or ''
        if ai_feedback and isinstance(ai_feedback, dict) and str(job_description).strip():
            ats_score = ai_feedback.get('ats_score')
            if ats_score is not None:
                try:
                    return int(ats_score)
                except (ValueError, TypeError):
                    pass
            
            review = ai_feedback.get('review')
            if review and isinstance(review, dict):
                section_analysis = review.get('section_analysis')
                if section_analysis and isinstance(section_analysis, list):
                    scores = []
                    for s in section_analysis:
                        if isinstance(s, dict) and 'score' in s:
                            try:
                                scores.append(int(s['score']))
                            except (ValueError, TypeError):
                                pass
                    if scores:
                        return sum(scores) // len(scores)

        # 2. Otherwise, calculate completeness score (max 100)
        score = 0

        # Profile Info: up to 20 pts (5 pts each)
        if data.get('full_name'): score += 5
        if data.get('email'): score += 5
        if data.get('phone_number'): score += 5
        if data.get('location'): score += 5

        # Work Experience: up to 30 pts (10 pts per experience up to 3)
        experiences = data.get('experiences', [])
        if isinstance(experiences, list):
            valid_exps = 0
            for exp in experiences:
                if isinstance(exp, dict) and (exp.get('company_name') or exp.get('job_title')):
                    valid_exps += 1
            score += min(valid_exps * 10, 30)

        # Skills: up to 25 pts (5 pts per skill up to 5)
        skills = data.get('skills', [])
        if isinstance(skills, list):
            valid_skills = [s for s in skills if s and str(s).strip()]
            score += min(len(valid_skills) * 5, 25)

        # Education: up to 15 pts (7.5 pts per education up to 2)
        educations = data.get('educations', [])
        if isinstance(educations, list):
            valid_edus = 0
            for edu in educations:
                if isinstance(edu, dict) and edu.get('school'):
                    valid_edus += 1
            score += min(int(valid_edus * 7.5), 15)

        # Target Role & Job Description: up to 10 pts (5 pts each)
        if data.get('target_role'): score += 5
        if data.get('job_description'): score += 5

        return score

    def save(self, *args, **kwargs):
        self.score = self.calculate_score()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.user.username})"

class Activity(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activities"
    )
    activity_type = models.CharField(max_length=50) # e.g. "ai_review", "download", "create"
    label = models.CharField(max_length=255)
    sub = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.label}"

