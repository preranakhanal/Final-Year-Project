from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import os
import tempfile
import traceback
import requests
from huggingface_hub import InferenceClient

def index(request):
    return render(request, 'chat/index.html')

@csrf_exempt
def transcribe_audio(request):
    """
    API endpoint to transcribe audio files to text using Whisper model.
    
    POST /api/transcribe/
    
    Request:
        - Method: POST
        - Content-Type: multipart/form-data
        - Body: audio file in 'audio' field
    
    Response:
        - Success (200): {"text": "transcribed text"}
        - Error (400/405/500): {"error": "error message"}
    """
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST method allowed',
            'allowed_methods': ['POST']
        }, status=405)
    
    if 'audio' not in request.FILES:
        return JsonResponse({
            'error': 'No audio file provided',
            'required_field': 'audio',
            'supported_formats': getattr(settings, 'ALLOWED_AUDIO_EXTENSIONS', ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac'])
        }, status=400)
    
    audio_file = request.FILES['audio']
    
    # Validate file size
    max_size = getattr(settings, 'MAX_AUDIO_FILE_SIZE', 25 * 1024 * 1024)
    if audio_file.size > max_size:
        return JsonResponse({
            'error': f'File too large. Maximum size allowed: {max_size / (1024*1024):.1f}MB',
            'file_size': f'{audio_file.size / (1024*1024):.1f}MB'
        }, status=400)
    
    # Validate file extension
    allowed_extensions = getattr(settings, 'ALLOWED_AUDIO_EXTENSIONS', ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac'])
    ext = os.path.splitext(audio_file.name)[1].lower() or '.webm'
    if ext not in allowed_extensions:
        return JsonResponse({
            'error': f'Unsupported file format: {ext}',
            'supported_formats': allowed_extensions
        }, status=400)
    
    # Save file temporarily
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_audio:
            for chunk in audio_file.chunks():
                temp_audio.write(chunk)
            temp_path = temp_audio.name
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to save uploaded file',
            'details': str(e)
        }, status=500)
    
    file_size = os.path.getsize(temp_path)
    print(f"Saved audio file: {temp_path}, size: {file_size} bytes, ext: {ext}")
    
    if file_size == 0:
        os.remove(temp_path)
        return JsonResponse({
            'error': 'Uploaded audio file is empty'
        }, status=400)
    
    # Transcribe using Hugging Face
    HF_TOKEN = os.environ.get('HF_TOKEN', 'your_token_here')
    if not HF_TOKEN or HF_TOKEN == 'your_token_here':
        os.remove(temp_path)
        return JsonResponse({
            'error': 'Hugging Face API token not configured',
            'setup_required': 'Please set HF_TOKEN environment variable'
        }, status=500)

    try:
        # Use direct HTTP request to Hugging Face API for better control
        api_url = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        
        # Get the correct MIME type for the audio file
        mime_types = {
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.m4a': 'audio/m4a',
            '.webm': 'audio/webm',
            '.ogg': 'audio/ogg',
            '.flac': 'audio/flac',
            '.mp4': 'audio/mp4'
        }
        content_type = mime_types.get(ext, 'audio/wav')
        
        # Send the audio file with proper content type
        with open(temp_path, 'rb') as f:
            audio_data = f.read()
        
        # Method 1: Direct HTTP request to Hugging Face API
        try:
            response = requests.post(
                api_url, 
                headers={**headers, 'Content-Type': content_type},
                data=audio_data
            )
            
            if response.status_code == 200:
                result = response.json()
                text = result.get('text', '') if isinstance(result, dict) else str(result)
            else:
                raise Exception(f"API returned status {response.status_code}: {response.text}")
                
        except Exception as direct_api_error:
            print(f"Direct API method failed: {direct_api_error}")
            
            # Method 2: Use InferenceClient with different approaches
            try:
                client = InferenceClient(token=HF_TOKEN)
                output = client.automatic_speech_recognition(audio_data, model="openai/whisper-large-v3")
                text = output if isinstance(output, str) else output.get('text', '')
            except Exception as client_error:
                print(f"InferenceClient method failed: {client_error}")
                
                # Method 3: Try with smaller/different model
                try:
                    output = client.automatic_speech_recognition(audio_data, model="openai/whisper-base")
                    text = output if isinstance(output, str) else output.get('text', '')
                except Exception as fallback_error:
                    print(f"Fallback model failed: {fallback_error}")
                    raise direct_api_error  # Raise the original error
        
        if not text:
            return JsonResponse({
                'error': 'No text could be transcribed from the audio file',
                'suggestion': 'Please ensure the audio contains clear speech'
            }, status=400)
            
        return JsonResponse({
            'text': text,
            'file_info': {
                'original_name': request.FILES['audio'].name,
                'size_mb': round(file_size / (1024*1024), 2),
                'format': ext
            }
        })
        
    except Exception as e:
        tb = traceback.format_exc()
        print(f"Transcription error: {e}\nTraceback:\n{tb}")
        return JsonResponse({
            'error': 'Transcription failed',
            'details': str(e),
            'suggestion': 'Please try with a different audio file or format'
        }, status=500)
        
    finally:
        # Clean up temporary file
        try:
            os.remove(temp_path)
        except Exception as cleanup_e:
            print(f"Temp file cleanup error: {cleanup_e}")

@csrf_exempt 
def get_session_info(request, session_id):
    """
    API endpoint to get session information including mode
    
    GET /api/session/<session_id>/
    
    Response:
        - Success (200): {"session_id": "...", "mode": "chat|quiz", "session_name": "..."}
        - Error (404): {"error": "Session not found"}
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)
    
    try:
        from chat.models import ChatSession
        session = ChatSession.objects.get(id=session_id)
        return JsonResponse({
            'session_id': str(session.id),
            'mode': session.mode,
            'session_name': session.session_name,
            'status': session.status,
            'start_time': session.start_time.isoformat()
        })
    except ChatSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)

@csrf_exempt
def create_session(request):
    """
    API endpoint to create a new chat session
    
    POST /api/session/create/
    
    Request:
        - Method: POST
        - Content-Type: application/json
        - Body: {"mode": "chat|quiz", "full_name": "optional"}
    
    Response:
        - Success (201): {"session_id": "...", "mode": "chat|quiz", "session_name": "..."}
        - Error (400): {"error": "error message"}
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        import json
        import uuid
        from chat.models import ChatSession
        
        data = json.loads(request.body) if request.body else {}
        mode = data.get('mode', 'chat')
        full_name = data.get('full_name', f"Visitor-{uuid.uuid4().hex[:6]}")
        
        if mode not in ['chat', 'quiz']:
            return JsonResponse({'error': 'Invalid mode. Must be "chat" or "quiz"'}, status=400)
        
        session_id = uuid.uuid4()
        session_name = f"{'Quiz' if mode == 'quiz' else 'Chat'}-{session_id}"
        
        session = ChatSession.objects.create(
            id=session_id,
            session_name=session_name,
            full_name=full_name,
            status='in_talking',
            mode=mode
        )
        
        return JsonResponse({
            'session_id': str(session.id),
            'mode': session.mode,
            'session_name': session.session_name,
            'full_name': session.full_name
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
