from rest_framework import serializers
from .models import Resume

class ExperienceSerializer(serializers.Serializer):
    company_name = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    job_title = serializers.CharField(required=False, allow_blank=True)
    date_from = serializers.CharField(required=False, allow_blank=True)
    date_to = serializers.CharField(required=False, allow_blank=True)
    bullet_points = serializers.ListField(child=serializers.CharField(), required=False)

class EducationSerializer(serializers.Serializer):
    school = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    school_type = serializers.CharField(required=False, allow_blank=True)
    date_from = serializers.CharField(required=False, allow_blank=True)
    date_to = serializers.CharField(required=False, allow_blank=True)
    has_content = serializers.BooleanField(default=False)
    content = serializers.CharField(required=False, allow_blank=True)

class ResumeDataSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    has_skill = serializers.BooleanField(default=True)
    skill_description = serializers.CharField(required=False, allow_blank=True)
    has_experience = serializers.BooleanField(default=True)
    experiences = ExperienceSerializer(many=True, required=False)
    has_education = serializers.BooleanField(default=True)
    educations = EducationSerializer(many=True, required=False)

class ResumeModelSerializer(serializers.ModelSerializer):
    data = ResumeDataSerializer()

    class Meta:
        model = Resume
        fields = ['id', 'title', 'data', 'file', 'status', 'updated_at']
        read_only_fields = ['id', 'file', 'updated_at']
