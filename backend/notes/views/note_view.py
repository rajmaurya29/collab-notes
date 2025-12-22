from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from notes.models import Note
from notes.serializers import NoteSerializer
from rest_framework.status import *

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def All_New_Note(request):
    if request.method=='GET':
        notes=Note.objects.filter(owner=request.user).order_by('-created_at')
        serializer=NoteSerializer(notes,many=True)
        return Response(serializer.data)

    elif request.method=='POST':
        note=Note.objects.create(
            owner=request.user,
            title=request.data['title'],
            content=request.data['content']
        )
        serializer=NoteSerializer(note,many=False)
        return Response(serializer.data)
    

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def Individual_Note(request,id):
    if request.method=="GET":
        try:
            note=Note.objects.get(                
                id=id)
            serializer=NoteSerializer(note,many=False)
            return Response(serializer.data)
        except:
            
            return Response({"message":"Not found"},status=HTTP_400_BAD_REQUEST)
    elif request.method=='PUT':
        try:
            note=Note.objects.get(
               owner=request.user,
               id=id)  
            note.title=request.data['title']
            note.content=request.data['content']
            note.category=request.data['category']
            serializer=NoteSerializer(note,many=False)
            note.save()
            return Response(serializer.data)
        except:
            return Response({"message":"cannot be edited"},status=HTTP_400_BAD_REQUEST)
        
    elif request.method=="DELETE":
        try:
            note=Note.objects.get(
               owner=request.user,
               id=id) 
            Note.delete(note)
            return Response({"message":"deleted successfully"})
        except:
            return Response({"message":"cannot be deleted"},status=HTTP_400_BAD_REQUEST)