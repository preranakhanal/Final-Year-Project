from django.contrib import admin

from chat.models import ChatSession, ChatMessage

admin.site.register(ChatSession)
admin.site.register(ChatMessage)
