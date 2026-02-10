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
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
# from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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


@permission_classes([IsAuthenticated])
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

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def fetchUser(request):
    if not request.user.is_authenticated:
        return Response({"message":"not authenticated"},status=400)
    userData=UserSerializer(request.user)
    return Response(userData.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def send_email(request):
#     if not request.user.is_authenticated:
#         return Response({"message":"not authenticated"},status=400)
#     user=request.user
#     print(user.email)
#     send_mail(
#         subject="Test Mail",
#         message="Hello from DRF backend",
#         from_email=None,
#         recipient_list=[user.email],
#         fail_silently=False,
#     )
#     return Response({"message":"email sent"})


#forgot password
token_generator=PasswordResetTokenGenerator()
@api_view(['POST'])
def forgot_password(request):
    data=request.data
    email=data.get("email")

    if not email:
        return Response({"message":"If user exit, email sent"})
    
    user=User.objects.filter(email=email).first()

    if user:
        uid=urlsafe_base64_encode(force_bytes(user.pk))
        token=token_generator.make_token(user)
        # print("uid "+uid)
        reset_link=(
            f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
        )
        html_content=render_to_string(
            "users/reset_password_email.html",
            {"reset_link":reset_link}
        )
        
        # text_content = strip_tags(html_content)
        # email_message=EmailMultiAlternatives(
        #     subject="Collab Notes password reset request",
        #     body=text_content,
        #     from_email=None,
        #     to=[user.email],
        # )
        # email_message.attach_alternative(html_content, "text/html")
        # email_message.send()
        try:
            message=Mail(
                from_email=settings.DEFAULT_FROM_EMAIL,
                to_emails=user.email,
                subject="Collab Notes password reset request",
                html_content=html_content
            )
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            sg.send(message)
        except Exception as e:
            print("sendgrid error:",e)
    return Response({"message":"If user exit, email sent"},status=HTTP_200_OK)
    
@api_view(['POST'])
def reset_password(request):
    data=request.data
    uid=data['uid']
    token=data['token']
    password=data['password']

    if not uid or not token or not password:
        return Response({"message":"Invalid attempt"},status=HTTP_400_BAD_REQUEST)
    try:
        user_id=force_str(urlsafe_base64_decode(uid))
        user=User.objects.get(id=user_id)
    except :
        return Response(
            {"message": "Invalid reset link"},
            status=HTTP_400_BAD_REQUEST
        )

    if not token_generator.check_token(user,token):
        return Response({"message":" Token expired or invalid"},status=HTTP_400_BAD_REQUEST)
    
    user.set_password(password)
    user.save()

    return Response({"message":"Password reset Successfully"},
                    status=HTTP_200_OK)
