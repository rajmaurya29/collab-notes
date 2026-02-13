from django.urls import path
from notes.views import note_view

urlpatterns = [
    path('',note_view.All_New_Note,name="all_new_note"),
    path('share/<uuid:token>/',note_view.Shared_note,name="shared_token"),
    path('toggle_shared/<int:id>/',note_view.toggle_shared,name="toggle_shared"),
    path('<int:id>/',note_view.Individual_Note,name="individual_note"),
    
]
