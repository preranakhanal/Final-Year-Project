import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_project.settings')

# Initialize Django
django.setup()

# Now import the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(chat.routing.websocket_urlpatterns),
})