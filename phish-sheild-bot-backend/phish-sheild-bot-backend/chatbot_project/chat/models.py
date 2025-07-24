from django.db import models
import uuid

class ChatSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='in_talking')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    mode = models.CharField(max_length=10, choices=[('chat', 'Chat'), ('quiz', 'Quiz')], default='chat')

    def __str__(self):
        return self.session_name

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, related_name='messages', on_delete=models.CASCADE)
    message = models.TextField()
    message_by = models.CharField(max_length=20)  # 'user' or 'bot'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.message_by}: {self.message[:50]}"
