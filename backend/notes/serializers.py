from notes.models import *
from rest_framework import serializers

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Note
        fields='__all__'
