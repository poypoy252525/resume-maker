from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ResumeStatusView, TaskStatusView, ActivityViewSet, PublicStatsView

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'activities', ActivityViewSet, basename='activity')


urlpatterns = [
    path('public-stats/', PublicStatsView.as_view(), name='public-stats'),
    path('resumes/status/<uuid:task_id>/<str:file_format>/', ResumeStatusView.as_view(), name='resume-status'),
    path('resumes/task-status/<uuid:task_id>/', TaskStatusView.as_view(), name='task-status'),
    path('', include(router.urls)),
]
