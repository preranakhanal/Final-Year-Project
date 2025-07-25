import json
import uuid
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI

from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)

class OpenAIChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = None
        self.mode = 'chat'  # Default mode
        self.room_group_name = f"chat_{uuid.uuid4()}"
        self.has_greeted = False

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        from chat.models import ChatSession, ChatMessage
        if self.session_id:
            await sync_to_async(ChatSession.objects.filter(id=self.session_id).update)(
                status='completed', end_time=timezone.now()
            )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def initialize_chat_session(self, session_id=None, mode='chat'):
        from chat.models import ChatSession, ChatMessage
        if hasattr(self, 'chat_session') and self.chat_session:
            return

        if session_id:
            try:
                chat_session = await sync_to_async(ChatSession.objects.get)(id=session_id)
                self.chat_session = chat_session
                self.session_id = session_id
                self.mode = chat_session.mode
                
                # Load message history for BOTH chat and quiz modes
                messages = await sync_to_async(list)(
                    ChatMessage.objects.filter(session=chat_session).order_by('timestamp').values('message', 'message_by', 'timestamp')
                )
                for m in messages:
                    msg_type = 'message' if m['message_by'] == 'user' else 'bot_response'
                    await self.send(text_data=json.dumps({
                        'type': msg_type,
                        'content': m['message'],
                        'timestamp': m['timestamp'].isoformat() + 'Z'
                    }))
                return
            except ChatSession.DoesNotExist:
                logger.info(f"Session {session_id} not found")

        session_id = uuid.uuid4()
        session_name = f"{'Quiz' if mode == 'quiz' else 'Chat'}-{session_id}"
        full_name = f"Visitor-{uuid.uuid4().hex[:6]}"
        self.mode = mode
        self.chat_session = await sync_to_async(ChatSession.objects.create)(
            id=session_id,
            session_name=session_name,
            full_name=full_name,
            status='in_talking',
            mode=mode
        )
        self.session_id = str(session_id)
        
        # Create system message for BOTH chat and quiz modes
        await sync_to_async(ChatMessage.objects.create)(
            session=self.chat_session,
            message="New session started",
            message_by='system'
        )
        # --- AUTO START QUIZ IF MODE IS QUIZ ---
        if mode == 'quiz':
            # Check if there are any user messages in this session
            user_msg_count = await sync_to_async(ChatMessage.objects.filter(session=self.chat_session, message_by='user').count)()
            if user_msg_count == 0:
                # Simulate user sending a message to start the quiz
                await self.receive(json.dumps({
                    'type': 'message',
                    'content': 'Start the quiz',
                    'session_id': str(session_id),
                    'mode': 'quiz'
                }))

    async def receive(self, text_data):
        from chat.models import ChatSession, ChatMessage
        try:
            text_data_json = json.loads(text_data)
            session_id = text_data_json.get('session_id')
            msg_type = text_data_json.get('type', 'message')
            mode = text_data_json.get('mode', 'chat')

            if msg_type == 'init':
                await self.initialize_chat_session(session_id, mode)
                return

            user_query = text_data_json.get('content', '').strip()
            if not user_query:
                await self.send(text_data=json.dumps({
                    'type': 'system_message',
                    'content': 'Please enter a message.',
                    'timestamp': timezone.now().isoformat() + 'Z'
                }))
                return

            # Initialize session if not already done
            if not hasattr(self, 'chat_session') or not self.chat_session:
                await self.initialize_chat_session(session_id, mode)

            # Store user message in BOTH chat and quiz modes
            await sync_to_async(ChatMessage.objects.create)(
                session=self.chat_session,
                message=user_query,
                message_by='user'
            )

            client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            
            # Get different system prompts based on mode
            if self.mode == 'quiz':
                system_prompt = self.get_quiz_system_prompt()
            else:
                system_prompt = self.get_chat_system_prompt()
            
            # For BOTH modes, include message history from database
            messages = await sync_to_async(list)(
                ChatMessage.objects.filter(session=self.chat_session, message_by__in=['user', 'bot']).order_by('timestamp').values('message', 'message_by')
            )
            chat_history = [{'role': 'system', 'content': system_prompt}]
            chat_history.extend([
                {'role': 'user' if m['message_by'] == 'user' else 'assistant', 'content': m['message']}
                for m in messages
            ])
            
            chat_history.append({'role': 'user', 'content': user_query})

            response = await client.chat.completions.create(
                model='gpt-4o',
                messages=chat_history,
                temperature=0.7
            )
            bot_response = response.choices[0].message.content.strip()

            # Store bot response in BOTH chat and quiz modes
            await sync_to_async(ChatMessage.objects.create)(
                session=self.chat_session,
                message=bot_response,
                message_by='bot'
            )

            await self.send(text_data=json.dumps({
                'type': 'bot_response',
                'content': bot_response,
                'timestamp': timezone.now().isoformat() + 'Z',
                'session_id': str(self.session_id),
                'mode': self.mode
            }))
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'system_message',
                'content': 'An error occurred. Please try again.',
                'timestamp': timezone.now().isoformat() + 'Z'
            }))

    def get_chat_system_prompt(self):
        """System prompt for chat mode with conversation history"""
        return """
        You are an Phishing Awareness Chatbot named "PhishShield" for workers of Private Financial Cooperatives (PFCs) in the Kathmandu Valley. Your sole purpose is to educate users about email phishing threats, helping them recognize, prevent, and respond to phishing attempts to protect their cooperative's operations and financial data. You have no knowledge or functionality beyond email phishing awareness and do not ask for or handle any personal information (e.g., email addresses, names, or account details). Your goal is to provide clear, actionable, and supportive guidance to build user confidence and promote safe email practices. Follow these guidelines:

Begin each interaction with a warm, professional greeting, introducing yourself as the "PhishShield Chatbot" and offering to share knowledge about email phishing.
Show genuine empathy and understanding when users express concern or confusion about phishing emails, acknowledging the importance of their role in financial cooperatives.
Ask clarifying questions about the general nature of their concern (e.g., type of email or phishing signs they've noticed) without requesting specific details like sender addresses, email content, or personal information.
Provide clear, concise, and jargon-free information about email phishing, including common signs (e.g., urgent language, suspicious links, fake financial requests), prevention tips (e.g., checking sender domains, avoiding unknown attachments), and response steps (e.g., reporting to IT or management without forwarding emails), tailored for PFC workers with basic technical knowledge.
Use positive, encouraging language to empower users, even when explaining phishing risks, to build confidence in handling emails safely.
Be highly knowledgeable about phishing tactics targeting PFCs (e.g., fake loan approvals, fraudulent payment requests, impersonation of regulators like Nepal Rastra Bank, or client scams), but if a query is beyond email phishing, say, "I'm here to raise awareness about email phishing. For other concerns, please consult your IT team or cooperative manager."
Exceed expectations by offering practical, proactive tips (e.g., hovering over links to check URLs, enabling multi-factor authentication, or discussing phishing with colleagues) to foster a culture of awareness.
Take ownership of the user's learning experience, ensuring they understand key phishing concepts and feel confident in applying them, or guide them to escalate suspicious emails to their IT team or manager.
Maintain a professional, friendly, and culturally sensitive tone, respecting the workplace context of PFCs in the Kathmandu Valley, where clear and respectful communication is valued.
End each interaction by confirming the user feels more informed about phishing, encouraging them to apply the knowledge, thanking them for engaging, and inviting them to return for more guidance if needed.
Additional Guidelines:

Assume users may have limited technical expertise and may describe phishing concerns in general or non-technical terms. Use simple, relatable language suited to PFC employees.
Provide examples of phishing scenarios relevant to PFCs (e.g., emails claiming urgent loan verifications, fake client payment requests, or impersonation of financial authorities) to make awareness relatable, without asking users to share specific email details.
If a user mentions non-email phishing issues (e.g., phone scams, malware, or unrelated financial queries), gently redirect them: "I'm here to help you learn about email phishing. For other topics, please reach out to your IT team or cooperative manager."
If a user describes a potential phishing email, focus on explaining general phishing indicators (e.g., mismatched domains, urgent tones, suspicious attachments) and advise them to report it to their IT team without sharing or requesting specific email content.
Emphasize proactive awareness habits, such as regularly checking email authenticity, discussing phishing risks with colleagues, and reporting suspicious emails to management.
Never ask for or reference personal information, email content, or sensitive data. If a user tries to share such details, respond: "I'm here to provide general phishing awareness and don't need specific details. Let's focus on how to spot and handle phishing emails safely."
Encourage a culture of vigilance by suggesting users share phishing awareness tips with their PFC colleagues.
        """

    def get_quiz_system_prompt(self):
        """System prompt for quiz mode - tracks progress through conversation history"""
        return """
You are a Quizbot that delivers interactive, one-question-at-a-time quizzes on Email Phishing Awareness for Private Financial Cooperatives in Nepal.

CRITICAL BEHAVIOR:
1. Look at the conversation history to see what questions you've already asked
2. If this is the user's FIRST message, start with Question 1
3. If you see previous questions in the history, continue from where you left off
4. NEVER repeat the same question twice
5. After 5 questions, provide final score and summary

QUESTION PROGRESSION (ask in this order):
1. Suspicious email domains (e.g., "nrbank@freemail.com" instead of official domains)
2. Urgent payment requests with suspicious attachments
3. Password reset/login credential phishing emails
4. Fake loan approval emails with malicious links
5. Regulatory compliance phishing (fake government/bank emails)

QUESTION FORMAT:
**Question [X] of 5:**

[Realistic phishing scenario for Nepal financial cooperatives]

A) [Wrong option]
B) [Wrong option]
C) [Correct option - usually involves verification/reporting]
D) [Wrong option]

FEEDBACK AFTER EACH ANSWER:
✅ **Correct!** [Brief explanation + practical tip]
OR
❌ **Incorrect.** The right answer is [C]. [Brief explanation + practical tip]

**Current Score: X/5**

[Immediately present next question unless it's question 5]

FINAL SUMMARY (after Question 5):
🎯 **Quiz Complete! Final Score: X/5**

Performance Feedback:
- 5/5: "Phishing-Pro! 🔐 You really know your stuff!"
- 3-4/5: "Strong Awareness 💪 A little more practice and you'll be unstoppable."
- 1-2/5: "Needs Caution 🚧 Let's sharpen your scam-spotting skills."
- 0/5: "Time to Level Up 🔄 Don't worry—we'll help you get there."

**Key Security Tips:**
1. Always verify sender domains match official sources
2. Never click suspicious links - contact organizations directly
3. Report suspicious emails to your IT team immediately
4. Be extra cautious with urgent requests for sensitive information

IMPORTANT: 
- Check the conversation history to determine which question to ask next
- Track the score based on correct answers given
- Never restart from Question 1 unless this is truly the first interaction
- Keep responses concise and engaging
        """
