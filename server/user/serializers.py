from rest_framework import serializers
from .models import User

class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'display_name', 'avatar')
        read_only_fields = ('email',)
