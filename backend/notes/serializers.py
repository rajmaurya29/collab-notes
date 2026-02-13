from notes.models import *
from rest_framework import serializers

class NoteSerializer(serializers.ModelSerializer):
    # ownerName=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Note
        fields=['id','title','category','updated_at']
    # def get_ownerName(self,obj):
    #     return obj.owner.first_name

class NoteDetailSerializer(serializers.ModelSerializer):
    ownerName=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Note
        fields='__all__'
    def get_ownerName(self,obj):
        return obj.owner.first_name
    
class NoteShareSerializer(serializers.ModelSerializer):
    class Meta:
        model=Note
        fields=['is_shared']