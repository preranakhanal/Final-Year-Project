from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.PredictPhishingView.as_view(), name='predict-phishing'),
]
