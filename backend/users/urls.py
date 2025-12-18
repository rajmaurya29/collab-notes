from django.urls import path
from users import views

urlpatterns = [
    path('login/',views.MyTokenObtainPairView.as_view(),name="login_user"),
    path('register/',views.registerUser,name="register_user"),
    path('logout/',views.logoutUser,name='logout_user'),
    path('health/',views.health,name='health'),
   
]
