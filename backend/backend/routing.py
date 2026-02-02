from django.urls import path,include
from notes.routing import websocket_urlpatterns as notes_ws
from channels.routing import URLRouter


websocket_urlpatterns = [
    path("ws/", URLRouter(notes_ws)),
]