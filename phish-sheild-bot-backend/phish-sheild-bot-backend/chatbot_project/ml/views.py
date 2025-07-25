from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import joblib
import os
import re
from html import unescape
import numpy as np
import openai
from django.conf import settings

# Load the model and vectorizer once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'phishing_email_model.joblib')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'phishing_email_vectorizer.joblib')
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Configure OpenAI
try:
    from openai import OpenAI
    api_key = getattr(settings, 'OPENAI_API_KEY', None) or os.environ.get('OPENAI_API_KEY')
    if api_key:
        openai_client = OpenAI(api_key=api_key)
        print("OpenAI client initialized successfully")
    else:
        openai_client = None
        print("Warning: OpenAI API key not found. Reasoning will use basic templates.")
except ImportError:
    openai_client = None
    print("Warning: OpenAI library not installed. Reasoning will use basic templates.")
except Exception as e:
    print(f"OpenAI configuration error: {e}")
    openai_client = None

def preprocess_text(text):
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Unescape HTML entities
    text = unescape(text)
    # Remove hyperlinks
    text = re.sub(r'http\S+', '', text)
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    # Remove CSS styles and JavaScript
    text = re.sub(r'style\s*=\s*["\'][^"\']*["\']', '', text)
    text = re.sub(r'class\s*=\s*["\'][^"\']*["\']', '', text)
    # Remove extra non-alphanumeric characters but keep spaces
    text = re.sub(r'[^\w\s]', ' ', text)
    # Convert to lowercase
    text = text.lower()
    # Remove extra spaces and normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove single characters that are not meaningful
    text = re.sub(r'\b[a-zA-Z]\b', '', text)
    return text

def extract_meaningful_text(html_content):
    """Extract meaningful text from HTML email content"""
    # Remove DOCTYPE, HTML, HEAD sections
    html_content = re.sub(r'<!DOCTYPE[^>]*>', '', html_content, flags=re.IGNORECASE)
    html_content = re.sub(r'<head[^>]*>.*?</head>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Extract text content from common email elements
    meaningful_text = []
    
    # Extract text from paragraphs
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html_content, flags=re.IGNORECASE | re.DOTALL)
    for p in p_tags:
        clean_p = re.sub(r'<[^>]+>', '', p).strip()
        if clean_p:
            meaningful_text.append(clean_p)
    
    # Extract text from td elements (table cells)
    td_tags = re.findall(r'<td[^>]*>(.*?)</td>', html_content, flags=re.IGNORECASE | re.DOTALL)
    for td in td_tags:
        clean_td = re.sub(r'<[^>]+>', '', td).strip()
        if clean_td and len(clean_td) > 10:  # Only meaningful content
            meaningful_text.append(clean_td)
    
    # Extract text from divs
    div_tags = re.findall(r'<div[^>]*>(.*?)</div>', html_content, flags=re.IGNORECASE | re.DOTALL)
    for div in div_tags:
        clean_div = re.sub(r'<[^>]+>', '', div).strip()
        if clean_div and len(clean_div) > 5:
            meaningful_text.append(clean_div)
    
    # Join all meaningful text
    text = ' '.join(meaningful_text)
    
    # If no meaningful text found, fall back to removing all tags
    if not text.strip():
        text = re.sub(r'<[^>]+>', '', html_content)
    
    return text

def explain_prediction(text, vectorizer, model, top_features=10):
    """
    Explain why the model made a specific prediction by showing the most influential words
    """
    # Transform the text to get feature vector
    X = vectorizer.transform([text])
    
    # Get prediction probabilities
    try:
        probabilities = model.predict_proba(X)[0]
        phishing_prob = probabilities[0]  # Assuming 0 is phishing class
        safe_prob = probabilities[1]      # Assuming 1 is safe class
    except:
        # If model doesn't support predict_proba, use decision_function or basic prediction
        prediction = model.predict(X)[0]
        phishing_prob = 0.9 if prediction == 0 else 0.1
        safe_prob = 0.9 if prediction == 1 else 0.1
    
    # Get feature names from vectorizer
    feature_names = vectorizer.get_feature_names_out()
    
    # Get the feature weights/coefficients if available
    explanation = {
        'phishing_probability': float(phishing_prob),
        'safe_probability': float(safe_prob),
        'prediction': 'phishing' if phishing_prob > safe_prob else 'safe',
        'confidence': max(phishing_prob, safe_prob),
        'influential_words': [],
        'reasoning': []
    }
    
    # Try to get feature importance
    try:
        if hasattr(model, 'coef_'):
            # For linear models like LogisticRegression, SVM
            coefficients = model.coef_[0]
            
            # Get non-zero features (words that appeared in the text)
            feature_indices = X.nonzero()[1]
            feature_scores = []
            
            for idx in feature_indices:
                word = feature_names[idx]
                coef = coefficients[idx]
                feature_value = X[0, idx]
                score = coef * feature_value
                feature_scores.append((word, score, coef))
            
            # Sort by absolute score (impact)
            feature_scores.sort(key=lambda x: abs(x[1]), reverse=True)
            
            # Get top features
            for word, score, coef in feature_scores[:top_features]:
                explanation['influential_words'].append({
                    'word': word,
                    'impact_score': float(score),
                    'coefficient': float(coef),
                    'direction': 'phishing' if coef < 0 else 'safe'
                })
        
        elif hasattr(model, 'feature_importances_'):
            # For tree-based models like RandomForest
            importances = model.feature_importances_
            feature_indices = X.nonzero()[1]
            
            feature_scores = []
            for idx in feature_indices:
                word = feature_names[idx]
                importance = importances[idx]
                feature_scores.append((word, importance))
            
            feature_scores.sort(key=lambda x: x[1], reverse=True)
            
            for word, importance in feature_scores[:top_features]:
                explanation['influential_words'].append({
                    'word': word,
                    'importance': float(importance)
                })
    
    except Exception as e:
        print(f"Error getting feature importance: {e}")
    
    # Generate reasoning text
    if explanation['prediction'] == 'phishing':
        explanation['reasoning'].append(f"The email is classified as PHISHING with {explanation['confidence']:.2%} confidence.")
        if explanation['influential_words']:
            phishing_words = [w['word'] for w in explanation['influential_words'] if w.get('direction') == 'phishing'][:5]
            if phishing_words:
                explanation['reasoning'].append(f"Suspicious words detected: {', '.join(phishing_words)}")
    else:
        explanation['reasoning'].append(f"The email is classified as SAFE with {explanation['confidence']:.2%} confidence.")
        if explanation['influential_words']:
            safe_words = [w['word'] for w in explanation['influential_words'] if w.get('direction') == 'safe'][:5]
            if safe_words:
                explanation['reasoning'].append(f"Safe indicators found: {', '.join(safe_words)}")
    
    return explanation

def get_phishing_indicators(text):
    """
    Check for common phishing indicators in the text
    """
    indicators = {
        'urgency_words': [],
        'suspicious_requests': [],
        'generic_greetings': [],
        'threat_language': [],
        'financial_terms': []
    }
    
    # Define patterns for different types of phishing indicators
    urgency_patterns = [
        r'\b(urgent|immediate|asap|expires?\s+(?:today|soon|now))\b',
        r'\b(act\s+now|limited\s+time|don\'t\s+wait)\b',
        r'\b(expires?\s+in\s+\d+\s+(?:hours?|days?|minutes?))\b'
    ]
    
    suspicious_requests = [
        r'\b(verify\s+(?:your\s+)?(?:account|identity|information))\b',
        r'\b(update\s+(?:your\s+)?(?:account|payment|information))\b',
        r'\b(confirm\s+(?:your\s+)?(?:account|identity|details))\b',
        r'\b(click\s+(?:here|link|below))\b',
        r'\b(suspended|disabled|locked)\b'
    ]
    
    generic_greetings = [
        r'\b(dear\s+(?:customer|user|client|valued|sir|madam))\b',
        r'\b(hello\s+(?:there|user))\b'
    ]
    
    threat_patterns = [
        r'\b(account\s+will\s+be\s+(?:closed|suspended|terminated))\b',
        r'\b(legal\s+action|lawsuit|investigation)\b',
        r'\b(security\s+breach|unauthorized\s+access)\b'
    ]
    
    financial_patterns = [
        r'\b(refund|tax\s+return|lottery|prize|winner)\b',
        r'\b(transfer|payment|invoice|billing)\b',
        r'\b(credit\s+card|bank\s+account|paypal)\b'
    ]
    
    text_lower = text.lower()
    
    # Check for urgency words
    for pattern in urgency_patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        indicators['urgency_words'].extend(matches)
    
    # Check for suspicious requests
    for pattern in suspicious_requests:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        indicators['suspicious_requests'].extend(matches)
    
    # Check for generic greetings
    for pattern in generic_greetings:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        indicators['generic_greetings'].extend(matches)
    
    # Check for threat language
    for pattern in threat_patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        indicators['threat_language'].extend(matches)
    
    # Check for financial terms
    for pattern in financial_patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        indicators['financial_terms'].extend(matches)
    
    return indicators

def generate_ai_reasoning(email_text, prediction, confidence, influential_words, phishing_indicators, total_indicators):
    """
    Generate human-like reasoning using OpenAI
    """
    if not openai_client:
        reasoning = generate_basic_reasoning(prediction, confidence, influential_words, phishing_indicators, total_indicators)
        # Always append prevention advice
        if isinstance(reasoning, list):
            reasoning = [r + " How can I prevent from this.." if not r.strip().endswith("How can I prevent from this..") else r for r in reasoning]
        return reasoning
    
    try:
        # Prepare the prompt for OpenAI
        prompt = f"""
As a cybersecurity expert, analyze this email and provide a warning/preventive explanation.

Email Content (first 300 chars): {email_text[:300]}...

Analysis Results:
- Classification: {prediction}
- Top suspicious/safe words: {', '.join([w['word'] for w in influential_words[:5]])}
- Warning signs found: {total_indicators}
- Types of concerns: {', '.join([k.replace('_', ' ') for k, v in phishing_indicators.items() if v])}

Write a warning/preventive explanation that:
1. Starts with "This email is safe as..." or "This email is dangerous as..."
2. Explains the main reason why it's safe or dangerous
3. Gives a clear warning or preventive advice
4. Uses simple, direct language

IMPORTANT: Write exactly 40-60 words. Be concise and warning-focused.
"""

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert specializing in phishing detection. Provide clear, professional explanations for email classifications."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.3
        )
        ai_reasoning = response.choices[0].message.content.strip()
        # Always append prevention advice
        if not ai_reasoning.strip().endswith("How can I prevent from this.."):
            ai_reasoning = ai_reasoning + " How can I prevent from this.."
        return [ai_reasoning]
    except Exception as e:
        print(f"OpenAI API error: {e}")
        reasoning = generate_basic_reasoning(prediction, confidence, influential_words, phishing_indicators, total_indicators)
        if isinstance(reasoning, list):
            reasoning = [r + " How can I prevent from this.." if not r.strip().endswith("How can I prevent from this..") else r for r in reasoning]
        return reasoning

def generate_basic_reasoning(prediction, confidence, influential_words, phishing_indicators, total_indicators):
    """
    Generate basic reasoning in warning/preventive format (40-60 words)
    """
    if prediction == 'phishing':
        # Build warning explanation
        main_reason = ""
        if phishing_indicators['urgency_words']:
            main_reason = "it uses urgent language to pressure you into quick action"
        elif phishing_indicators['suspicious_requests']:
            main_reason = "it asks you to verify accounts or share personal details"
        elif phishing_indicators['threat_language']:
            main_reason = "it threatens account closure or legal consequences"
        elif phishing_indicators['generic_greetings']:
            main_reason = "it uses generic greetings instead of your actual name"
        elif phishing_indicators['financial_terms']:
            main_reason = "it mentions unexpected money, refunds, or payments"
        else:
            main_reason = "it contains multiple red flags commonly used by scammers"
        full_text = f"This email is dangerous as {main_reason}. Never click links, download attachments, or share personal information. Delete immediately and report as spam to stay protected. How can I prevent from this.."
    else:
        # Build safe explanation with preventive advice
        main_reason = ""
        if total_indicators == 0:
            main_reason = "no suspicious patterns or warning signs were detected"
        else:
            main_reason = "it appears to use legitimate business language and proper formatting"
        full_text = f"This email is safe as {main_reason}. However, always verify sender identity before clicking links or sharing sensitive information, especially for important requests. How can I prevent from this.."
    return [full_text]

class PredictPhishingView(APIView):
    def post(self, request):
        body = request.data.get('body', '')
        # First extract meaningful text from HTML
        print(f"Received body length: {len(body)}")
        meaningful_text = extract_meaningful_text(body)
        print(f"Extracted meaningful text: {meaningful_text}")
        
        # Then preprocess the extracted text
        clean_body = preprocess_text(meaningful_text)
        print(f"Cleaned body: {clean_body[:200]}...")
        
        # Get explanation for the prediction
        explanation = explain_prediction(clean_body, vectorizer, model)
        
        # Get phishing indicators
        indicators = get_phishing_indicators(meaningful_text)
        
        # Make prediction
        X = vectorizer.transform([clean_body])
        prediction = model.predict(X)[0]
        status_str = 'phishing' if prediction == 0 else 'safe'
        
        print(f"Model prediction: {prediction}")
        print(f"Prediction status: {status_str}")
        print(f"Confidence: {explanation['confidence']:.2%}")
        print(f"Reasoning: {'; '.join(explanation['reasoning'])}")
        
        # Print phishing indicators found
        total_indicators = sum(len(v) for v in indicators.values())
        if total_indicators > 0:
            print(f"Phishing indicators found ({total_indicators} total):")
            for category, items in indicators.items():
                if items:
                    print(f"  {category.replace('_', ' ').title()}: {', '.join(set(items))}")
        
        # Print top influential words
        if explanation['influential_words']:
            print("Top influential words:")
            for word_info in explanation['influential_words'][:5]:
                if 'direction' in word_info:
                    print(f"  - '{word_info['word']}' -> {word_info['direction']} (score: {word_info['impact_score']:.4f})")
                else:
                    print(f"  - '{word_info['word']}' (importance: {word_info['importance']:.4f})")
        
        # Generate AI-powered reasoning
        ai_reasoning = generate_ai_reasoning(
            meaningful_text, 
            status_str, 
            explanation['confidence'],
            explanation['influential_words'],
            indicators,
            total_indicators
        )
        
        print(f"AI Reasoning: {' '.join(ai_reasoning)}")
        
        return Response({
            'status': status_str,
            'prediction': int(prediction),
            'confidence': explanation['confidence'],
            'phishing_probability': explanation['phishing_probability'],
            'safe_probability': explanation['safe_probability'],
            'reasoning': ai_reasoning,  # Use AI-generated reasoning
            'technical_details': {
                'influential_words': explanation['influential_words'],
                'phishing_indicators': indicators,
                'total_indicators': total_indicators,
                'model_reasoning': explanation['reasoning']  # Keep original for debugging
            }
        }, status=status.HTTP_200_OK)

# Create your views here.
