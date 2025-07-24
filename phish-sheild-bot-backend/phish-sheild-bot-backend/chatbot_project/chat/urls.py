from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/transcribe/', views.transcribe_audio, name='transcribe_audio'),
    path('api/session/create/', views.create_session, name='create_session'),
    path('api/session/<uuid:session_id>/', views.get_session_info, name='get_session_info'),
]
