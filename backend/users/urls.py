from django.urls import path
from users import views

urlpatterns = [
    path('login/',views.MyTokenObtainPairView.as_view(),name="login_user"),
    path('register/',views.registerUser,name="register_user"),
    path('logout/',views.logoutUser,name='logout_user'),
    path('fetch/',views.fetchUser,name='fetch_user'),
    path('health/',views.health,name='health'),
    # path('mail/',views.send_email,name='send_email'),
    path('forgot-password/',views.forgot_password,name='forgot-password'),
    path('reset-password/',views.reset_password,name='reset-password'),

   
]
