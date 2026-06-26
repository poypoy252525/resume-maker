from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from celery.result import AsyncResult
from .models import Resume, Activity
from .tasks import generate_document_task, analyze_resume_task, paraphrase_bullet_task, recommend_job_description_task, recommend_skills_task
from .serializers import ResumeModelSerializer, ResumeDataSerializer, ActivitySerializer
from .services.ai_service import AIService


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeModelSerializer
    
    def get_queryset(self):
        # Only return resumes belonging to the authenticated user
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        resume = serializer.save(user=self.request.user)
        Activity.objects.create(
            user=self.request.user,
            activity_type='create',
            label=f"Created {resume.title}",
            sub="Started a new resume draft"
        )

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_no_id(self, request):
        # Use ResumeDataSerializer to validate the JSON data directly from request
        data_serializer = ResumeDataSerializer(data=request.data)
        if data_serializer.is_valid():
            user_id = request.user.id if request.user.is_authenticated else None
            task = generate_document_task.delay(data_serializer.validated_data, user_id=user_id)
            
            return Response({
                "message": "Resume generation started.",
                "task_id": task.id
            }, status=status.HTTP_202_ACCEPTED)
        
        return Response(data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        resume = self.get_object()
        
        # Use ResumeDataSerializer to validate the JSON data before generation
        data_serializer = ResumeDataSerializer(data=resume.data)
        if data_serializer.is_valid():
            resume.status = Resume.Status.PROCESSING
            resume.save()
            
            user_id = request.user.id if request.user.is_authenticated else None
            task = generate_document_task.delay(data_serializer.validated_data, user_id=user_id)
            
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
        
        user_id = request.user.id if request.user.is_authenticated else None
        try:
            task = analyze_resume_task.delay(resume_data, job_description, target_role, user_id=user_id)
            return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def paraphrase(self, request):
        bullet_point = request.data.get('bullet_point', '')
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')

        if not bullet_point:
            return Response({"error": "Bullet point is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ai_service = AIService()
            result = ai_service.paraphrase_bullet(bullet_point, target_role, job_description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def recommend_job_description(self, request):
        job_title = request.data.get('job_title', '')
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')

        if not job_title:
            return Response({"error": "Job title is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ai_service = AIService()
            result = ai_service.recommend_job_description(job_title, target_role, job_description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def recommend_skills(self, request):
        target_role = request.data.get('target_role', '')
        job_description = request.data.get('job_description', '')

        try:
            ai_service = AIService()
            result = ai_service.recommend_skills(target_role, job_description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResumeStatusView(APIView):
    def get(self, request, task_id, file_format='pdf', *args, **kwargs):
        res = AsyncResult(str(task_id))
        
        if res.ready():
            if res.successful():
                media_path = f"{settings.MEDIA_URL}resumes/{res.result}.{file_format}"
                if settings.SITE_URL:
                    file_url = f"{settings.SITE_URL.rstrip('/')}{media_path}"
                else:
                    file_url = request.build_absolute_uri(media_path)
                
                return Response({
                    "status": "SUCCESS",
                    "file_url": file_url
                })
            else:
                return Response({
                    "status": "FAILURE",
                    "error": str(res.result)
                })
        return Response({"status": "PENDING"})

class TaskStatusView(APIView):
    """
    Generic task status view for AI operations.
    """
    def get(self, request, task_id, *args, **kwargs):
        res = AsyncResult(str(task_id))
        if res.ready():
            if res.successful():
                return Response({
                    "status": "SUCCESS",
                    "result": res.result
                })
            else:
                return Response({
                    "status": "FAILURE",
                    "error": str(res.result)
                })
        return Response({"status": "PENDING"})

class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)

