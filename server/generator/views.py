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
