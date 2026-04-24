from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult
from .tasks import generate_document_task
from .serializers import ResumeSerializer

class ResumeGenerateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            context = serializer.validated_data
            task = generate_document_task.delay(context)
            
            return Response({
                "message": "Resume generation started.",
                "task_id": task.id
            }, status=status.HTTP_202_ACCEPTED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeStatusView(APIView):
    def get(self, request, task_id, *args, **kwargs):
        res = AsyncResult(task_id)
        if res.ready():
            if res.successful():
                return Response({
                    "status": "SUCCESS",
                    "file_url": f"{settings.SITE_URL}/static/resumes/{res.result}.pdf"
                })
            else:
                return Response({
                    "status": "FAILURE",
                    "error": str(res.result)
                })
        return Response({"status": "PENDING"})
