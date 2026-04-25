from django.core.exceptions import ValidationError

def validate_resume_data(value):
    """
    Validates the structure of the resume data JSON using the ResumeDataSerializer.
    This ensures the model and API share the same validation logic.
    """
    if not isinstance(value, dict):
        raise ValidationError("Resume data must be a JSON object.")

    # Local import to avoid circular dependency
    from .serializers import ResumeDataSerializer
    
    serializer = ResumeDataSerializer(data=value)
    if not serializer.is_valid():
        # Format the serializer errors into a readable string
        error_msg = "; ".join([f"{k}: {v}" for k, v in serializer.errors.items()])
        raise ValidationError(f"Invalid resume structure: {error_msg}")
