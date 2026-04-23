from rest_framework import serializers

class ExperienceSerializer(serializers.Serializer):
    company_name = serializers.CharField()
    location = serializers.CharField()
    job_title = serializers.CharField()
    date_from = serializers.CharField()
    date_to = serializers.CharField()
    bullet_points = serializers.ListField(child=serializers.CharField())

class EducationSerializer(serializers.Serializer):
    school = serializers.CharField()
    location = serializers.CharField()
    school_type = serializers.CharField()
    date_from = serializers.CharField()
    date_to = serializers.CharField()
    has_content = serializers.BooleanField()
    content = serializers.CharField(required=False, allow_blank=True)

class ResumeSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    location = serializers.CharField()
    has_skill = serializers.BooleanField()
    skill_description = serializers.CharField()
    has_experience = serializers.BooleanField()
    experiences = ExperienceSerializer(many=True)
    has_education = serializers.BooleanField()
    educations = EducationSerializer(many=True)
