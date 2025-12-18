from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.serializers import *
from rest_framework.status import *
from users.models import *
from django.http import HttpResponse
import csv 
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data=super().validate(attrs)
        serializer=UserSerializer(self.user).data
        for k,v in serializer.items():
            data[k]=v
        return data



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    def post(self,request,*args,**kwargs):
        response=super().post(request,*args,**kwargs)
        access_token=response.data.get('access')
        refresh_token=response.data.get('refresh')
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
        return response


@api_view(['HEAD'])
def health(request):
    return Response({"status":"ok"})

 
@api_view(['POST'])
def registerUser(request):
    data=request.data
  
    try:
        validate_email(data['email'])
        validate_password(data["password"])
        user=User.objects.create_user(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=data["password"]
        )   
        serializer=UserSerializer(user,many=False)
        return Response(serializer.data)
    except ValidationError as e:
        message={"message":e.messages}
        return Response(message,status=HTTP_400_BAD_REQUEST)
    except:
        message={"message":"Invalid user or user already exist"}
        return Response(message,status=HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def logoutUser(request):
    response=Response({"message":"logout successfully"},status=HTTP_200_OK)
    response.set_cookie(
            key='access_token',
            value='',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
    response.set_cookie(
            key='refresh_token',
            value='',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
    return response