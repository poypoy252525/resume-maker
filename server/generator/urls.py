from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ResumeStatusView, TaskStatusView

router = DefaultRouter()
router.register(r'', ResumeViewSet, basename='resume')

urlpatterns = [
    path('', include(router.urls)),
    path('status/<str:task_id>/', ResumeStatusView.as_view(), name='resume-status'),
    path('task-status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
]
