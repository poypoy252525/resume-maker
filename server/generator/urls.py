from django.urls import path
from .views import ResumeGenerateView, ResumeStatusView

urlpatterns = [
    path('generate/', ResumeGenerateView.as_view(), name='resume-generate'),
    path('status/<str:task_id>/', ResumeStatusView.as_view(), name='resume-status'),
]
