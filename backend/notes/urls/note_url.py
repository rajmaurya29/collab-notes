from django.urls import path
from notes.views import note_view

urlpatterns = [
    path('',note_view.All_New_Note,name="all_new_note"),
    path('<int:id>/',note_view.Individual_Note,name="individual_note"),
   
]
