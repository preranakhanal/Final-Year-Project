from django.urls import re_path
from .consumers import OpenAIChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/$', OpenAIChatConsumer.as_asgi()),
    re_path(r'ws/openai-chat/$', OpenAIChatConsumer.as_asgi()),  # For HTML template compatibility
]
