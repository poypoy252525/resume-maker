from django.conf import settings
from django.db.models import Avg
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from celery.result import AsyncResult
from .models import Resume, Activity
from .tasks import generate_document_task, analyze_resume_task, paraphrase_bullet_task, recommend_job_description_task, recommend_skills_task, tailor_resume_task
from .serializers import ResumeModelSerializer, ResumeDataSerializer, ActivitySerializer
from .services.ai_service import AIService

User = get_user_model()


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

    def perform_destroy(self, instance):
        title = instance.title
        if instance.file:
            instance.file.delete(save=False)
        if instance.photo:
            instance.photo.delete(save=False)
        instance.delete()
        Activity.objects.create(
            user=self.request.user,
            activity_type='delete',
            label=f"Deleted {title}",
            sub="Removed resume from workspace"
        )

    @action(detail=True, methods=['post', 'delete'], url_path='upload-photo')
    def upload_photo(self, request, pk=None):
        resume = self.get_object()
        
        if request.method == 'DELETE':
            if resume.photo:
                resume.photo.delete(save=True)
            if isinstance(resume.data, dict) and 'photo' in resume.data:
                resume.data['photo'] = ""
                resume.save()
            return Response({"message": "Photo removed successfully."}, status=status.HTTP_200_OK)
            
        file_obj = request.FILES.get('photo')
        if not file_obj:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        if resume.photo:
            resume.photo.delete(save=False)
            
        resume.photo = file_obj
        resume.save()
        
        photo_url = request.build_absolute_uri(resume.photo.url)
        if isinstance(resume.data, dict):
            resume.data['photo'] = photo_url
            resume.save()
            
        return Response({
            "photo_url": photo_url
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_no_id(self, request):
        # Use ResumeDataSerializer to validate the JSON data directly from request
        data_serializer = ResumeDataSerializer(data=request.data)
        if data_serializer.is_valid():
            user_id = request.user.id if request.user.is_authenticated else None
            is_preview = request.query_params.get('preview', 'false').lower() == 'true'
            task = generate_document_task.delay(data_serializer.validated_data, user_id=user_id, is_preview=is_preview)
            
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
            is_preview = request.query_params.get('preview', 'false').lower() == 'true'
            task = generate_document_task.delay(
                data_serializer.validated_data, 
                user_id=user_id,
                resume_id=str(resume.id),
                is_preview=is_preview
            )
            
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
    def tailor(self, request):
        resume_data = request.data.get('resume_data', {})
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')
        
        user_id = request.user.id if request.user.is_authenticated else None
        try:
            task = tailor_resume_task.delay(resume_data, target_role, job_description, user_id=user_id)
            return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def paraphrase(self, request):
        bullet_point = request.data.get('bullet_point', '')
        job_description = request.data.get('job_description', '')
        target_role = request.data.get('target_role', '')
        job_title = request.data.get('job_title', '')

        if not bullet_point:
            return Response({"error": "Bullet point is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ai_service = AIService()
            result = ai_service.paraphrase_bullet(bullet_point, target_role, job_description, job_title)
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

    @action(detail=False, methods=['post'])
    def recommend_summary(self, request):
        resume_data = request.data.get('resume_data', {})
        target_role = request.data.get('target_role', '')
        job_description = request.data.get('job_description', '')

        try:
            ai_service = AIService()
            result = ai_service.recommend_summary(resume_data, target_role, job_description)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='import-pdf')
    def import_pdf(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not file_obj.name.lower().endswith('.pdf'):
            return Response({"error": "Only PDF files are supported."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            import io
            from pypdf import PdfReader
            
            pdf_bytes = file_obj.read()
            reader = PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if not text.strip():
                return Response({
                    "error": "Could not extract any text from the PDF. Please make sure the PDF contains selectable text (is not a scanned image)."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            ai_service = AIService()
            parsed_data = ai_service.parse_resume_text(text)
            
            # Log Activity if authenticated
            if request.user.is_authenticated:
                Activity.objects.create(
                    user=request.user,
                    activity_type='create',
                    label=f"Imported resume from PDF",
                    sub=f"Extracted details from {file_obj.name}"
                )
                
            return Response(parsed_data, status=status.HTTP_200_OK)
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


class PublicStatsView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        total_resumes = Resume.objects.count()
        total_users = User.objects.count()

        # Calculate average score for resumes with score > 0
        resumes_with_score = Resume.objects.filter(score__gt=0)
        avg_score = resumes_with_score.aggregate(Avg('score'))['score__avg']
        if avg_score is not None:
            ats_pass_rate = round(float(avg_score), 1)
        else:
            ats_pass_rate = 99.9

        # Calculate success rate: % of resumes with score >= 70
        if total_resumes > 0:
            high_scores = Resume.objects.filter(score__gte=70).count()
            success_rate = round((high_scores / total_resumes) * 100, 1)
        else:
            success_rate = 94.0

        return Response({
            "resumes_built": total_resumes,
            "success_rate": success_rate,
            "active_users": total_users,
            "ats_pass_rate": ats_pass_rate
        })


