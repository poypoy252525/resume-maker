from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ResumeStatusView, TaskStatusView

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('resumes/status/<uuid:task_id>/<str:file_format>/', ResumeStatusView.as_view(), name='resume-status'),
    path('resumes/task-status/<uuid:task_id>/', TaskStatusView.as_view(), name='task-status'),
    path('', include(router.urls)),
]
