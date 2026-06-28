from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Resume

User = get_user_model()

class ResumeScoreTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")

    def test_completeness_score_calculation(self):
        resume = Resume.objects.create(
            user=self.user,
            title="My Resume",
            data={
                "full_name": "John Doe",
                "email": "john@example.com",
                "phone_number": "123-456-7890",
                "location": "San Francisco, CA",
                "skills": ["Python", "Django", "React"],
                "experiences": [
                    {"company_name": "Google", "job_title": "Software Engineer"}
                ],
                "educations": [
                    {"school": "Stanford University"}
                ],
                "target_role": "Senior Engineer",
                "job_description": "We need a Senior Software Engineer..."
            }
        )
        # Verify score gets calculated and saved
        # Profile: +20 (all 4)
        # Skills: 3 * 5 = +15
        # Experiences: 1 * 10 = +10
        # Educations: 1 * 7.5 = +7 (since cast to int)
        # Target role & JD: +10
        # Total = 20 + 15 + 10 + 7 + 10 = 62
        self.assertEqual(resume.score, 62)

    def test_ai_feedback_score_prioritization(self):
        resume = Resume.objects.create(
            user=self.user,
            title="AI Evaluated Resume",
            data={
                "full_name": "John Doe",
                "email": "john@example.com",
                "job_description": "We need a skilled backend engineer...",
                "ai_feedback": {
                    "ats_score": 85,
                    "review": {
                        "section_analysis": [
                            {"section_name": "Work Experience", "score": 90, "what_to_improve": "Good"},
                            {"section_name": "Skills", "score": 80, "what_to_improve": "Add more"}
                        ]
                    }
                }
            }
        )
        # Should prioritize ats_score (85) since job_description is present
        self.assertEqual(resume.score, 85)

    def test_ai_feedback_without_jd_falls_back_to_completeness(self):
        """AI ats_score of 0 (no JD) should NOT override completeness score."""
        resume = Resume.objects.create(
            user=self.user,
            title="AI Without JD",
            data={
                "full_name": "John Doe",
                "email": "john@example.com",
                "phone_number": "123-456-7890",
                "location": "San Francisco, CA",
                "job_description": "",  # No JD
                "ai_feedback": {
                    "ats_score": 0,  # AI returned 0 because no JD to compare
                }
            }
        )
        # Should fall back to completeness score (4 profile fields = 20)
        self.assertEqual(resume.score, 20)


class PublicStatsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.other_user = User.objects.create_user(username="otheruser", password="password")

    def test_public_stats_empty_database(self):
        url = reverse('public-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['resumes_built'], 0)
        self.assertEqual(data['active_users'], 2)
        self.assertEqual(data['ats_pass_rate'], 99.9)
        self.assertEqual(data['success_rate'], 94.0)

    def test_public_stats_with_data(self):
        Resume.objects.create(
            user=self.user,
            title="Resume 1",
            data={
                "full_name": "User 1",
                "email": "1@ex.com",
                "job_description": "JD",
                "ai_feedback": {"ats_score": 80}
            }
        )
        Resume.objects.create(
            user=self.other_user,
            title="Resume 2",
            data={
                "full_name": "User 2",
                "email": "2@ex.com",
                "job_description": "JD",
                "ai_feedback": {"ats_score": 50}
            }
        )

        url = reverse('public-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['resumes_built'], 2)
        self.assertEqual(data['active_users'], 2)
        self.assertEqual(data['ats_pass_rate'], 65.0)
        self.assertEqual(data['success_rate'], 50.0)

