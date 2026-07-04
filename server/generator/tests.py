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


from unittest.mock import patch

class AISummaryTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_login(self.user)

    @patch('generator.views.AIService')
    def test_recommend_summary_success(self, mock_ai_service_class):
        # Configure the mock to return a dummy summary
        mock_instance = mock_ai_service_class.return_value
        mock_instance.recommend_summary.return_value = {
            "summary": "This is a mocked professional summary."
        }

        url = reverse('resume-recommend-summary')
        payload = {
            "resume_data": {"full_name": "Test User"},
            "target_role": "Software Engineer",
            "job_description": "We need a Python developer."
        }
        
        response = self.client.post(url, payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"summary": "This is a mocked professional summary."})
        mock_instance.recommend_summary.assert_called_once_with(
            {"full_name": "Test User"},
            "Software Engineer",
            "We need a Python developer."
        )


class AITailorTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        from rest_framework.authtoken.models import Token
        self.token = Token.objects.create(user=self.user)

    @patch('generator.views.tailor_resume_task')
    def test_tailor_resume_endpoint_starts_task(self, mock_tailor_task):
        class DummyTask:
            id = "test-task-uuid-1234"
        mock_tailor_task.delay.return_value = DummyTask()

        url = reverse('resume-tailor')
        payload = {
            "resume_data": {"full_name": "Test User"},
            "target_role": "Backend Engineer",
            "job_description": "We need a Django expert."
        }
        
        response = self.client.post(
            url, 
            payload, 
            content_type='application/json',
            HTTP_AUTHORIZATION=f"Token {self.token.key}"
        )
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json(), {"task_id": "test-task-uuid-1234"})
        mock_tailor_task.delay.assert_called_once_with(
            {"full_name": "Test User"},
            "Backend Engineer",
            "We need a Django expert.",
            user_id=self.user.id
        )


class ResumeImportTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        from rest_framework.authtoken.models import Token
        self.token = Token.objects.create(user=self.user)

    @patch('generator.views.AIService')
    @patch('pypdf.PdfReader')
    def test_import_pdf_success(self, mock_pdf_reader, mock_ai_service_class):
        # Configure PdfReader mock pages
        mock_pages = []
        mock_page = type('MockPage', (), {})()
        mock_page.extract_text = lambda: "John Doe\nSoftware Engineer\nPython, Django"
        mock_pages.append(mock_page)
        
        mock_pdf_reader.return_value.pages = mock_pages
        
        # Configure AIService mock
        mock_instance = mock_ai_service_class.return_value
        mock_instance.parse_resume_text.return_value = {
            "full_name": "John Doe",
            "email": "",
            "phone_number": "",
            "location": "",
            "has_skill": True,
            "skills": ["Python", "Django"],
            "experiences": [],
            "educations": []
        }

        # Create dummy PDF file
        import io
        dummy_pdf = io.BytesIO(b"%PDF-1.4 dummy content")
        dummy_pdf.name = "test_resume.pdf"

        url = reverse('resume-import-pdf')
        response = self.client.post(
            url,
            {"file": dummy_pdf},
            HTTP_AUTHORIZATION=f"Token {self.token.key}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["full_name"], "John Doe")
        self.assertEqual(response.json()["skills"], ["Python", "Django"])





