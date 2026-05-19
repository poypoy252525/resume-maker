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

