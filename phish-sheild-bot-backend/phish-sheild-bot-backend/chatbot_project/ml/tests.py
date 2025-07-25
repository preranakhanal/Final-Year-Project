from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase

class PhishingPredictionTest(APITestCase):
    def test_predict_phishing(self):
        url = reverse('predict-phishing')
        data = {'subject': 'Urgent: Verify your account', 'body': 'Click here to update your information.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('label', response.data)
        self.assertIn('score', response.data)
