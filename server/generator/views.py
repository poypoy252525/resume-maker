from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from celery.result import AsyncResult
from .models import Resume
from .tasks import generate_document_task
from .serializers import ResumeModelSerializer, ResumeDataSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeModelSerializer
    
    def get_queryset(self):
        # Only return resumes belonging to the authenticated user
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        resume = self.get_object()
        
        # Use ResumeDataSerializer to validate the JSON data before generation
        data_serializer = ResumeDataSerializer(data=resume.data)
        if data_serializer.is_valid():
            resume.status = Resume.Status.PROCESSING
            resume.save()
            
            task = generate_document_task.delay(data_serializer.validated_data)
            
            return Response({
                "message": "Resume generation started.",
                "task_id": task.id
            }, status=status.HTTP_202_ACCEPTED)
        
        return Response(data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        resume_data = request.data.get('resume_data', {})
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')
        
        if not job_description:
            return Response({"error": "Job description is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        from .services.ai_service import AIService
        try:
            ai_service = AIService()
            
            # Evaluate ATS
            ats_result = ai_service.evaluate_ats(resume_data, job_description)
            
            # Recommend Skills
            skills_result = ai_service.recommend_skills(target_role, job_description)
            
            ai_feedback = {
                'ats_score': ats_result.get('ats_score', 0),
                'keyword_match': ats_result.get('keyword_match', []),
                'missing_keywords': ats_result.get('missing_keywords', []),
                'suggestions': ats_result.get('suggestions', []),
                'recommended_skills': skills_result.get('recommended_skills', []),
                'skills_reasoning': skills_result.get('reasoning', '')
            }
            
            return Response(ai_feedback, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def paraphrase(self, request):
        bullet_point = request.data.get('bullet_point', '')
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')

        if not bullet_point:
            return Response({"error": "Bullet point is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not job_description:
            return Response({"error": "Job description is required for optimization."}, status=status.HTTP_400_BAD_REQUEST)

        from .services.ai_service import AIService
        try:
            ai_service = AIService()
            result = ai_service.paraphrase_bullet(bullet_point, target_role, job_description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResumeStatusView(APIView):
    def get(self, request, task_id, *args, **kwargs):
        res = AsyncResult(task_id)
        if res.ready():
            if res.successful():
                return Response({
                    "status": "SUCCESS",
                    "file_url": f"{settings.SITE_URL}{settings.MEDIA_URL}resumes/{res.result}.pdf"
                })
            else:
                return Response({
                    "status": "FAILURE",
                    "error": str(res.result)
                })
        return Response({"status": "PENDING"})
