# Phishing Detector Chrome Extension

This project is a Chrome extension designed to detect phishing emails in Gmail using a combination of machine learning techniques and browser capabilities. The extension analyzes email content and images to identify potential phishing attempts and alerts users with a warning popup.

## Features

- **Email Monitoring**: Monitors opened emails in Gmail and extracts relevant details for analysis.
- **Phishing Detection**: Utilizes a multi-modal detection system that includes:
  - Lightweight text analysis in the browser using TensorFlow.js.
  - Image analysis on the backend using TensorFlow or PyTorch.
- **User Alerts**: Displays a warning popup for suspicious emails with options to learn more about phishing.
- **Interactive UI**: Provides a user-friendly interface for alerts and information.

## Tech Stack

- **Frontend**: React + JavaScript with Chrome Extension APIs
- **ML Processing**: Hybrid approach - lightweight text analysis in the browser + image analysis on the backend
- **Backend**: Django Python ML services
- **ML Frameworks**: TensorFlow.js (browser) + TensorFlow/PyTorch (server)

## System Flow

1. The extension monitors Gmail API for opened emails.
2. Extracts text, images, and metadata from the emails.
3. Performs quick text analysis locally (< 100ms).
4. If suspicious patterns are found, sends images to the server for further analysis.
5. Displays an immediate warning popup for the user.
6. Continues background analysis for a final verdict.

## Phishing Types Detected

- Credential harvesting (fake login pages)
- Business Email Compromise (BEC)
- Social engineering attacks
- Malware distribution
- Brand impersonation
- Romance/advance fee scams

## Datasets Used

- Nazario Phishing Corpus
- PhishTank Database
- APWG eCrime Exchange
- Enron Email Dataset (for legitimate emails)
- SpamAssassin Public Corpus

## Getting Started

1. Clone the repository.
2. Navigate to the `extension` directory and install dependencies using npm.
3. Load the extension in Chrome via the Extensions page (chrome://extensions).
4. Follow the setup instructions to authenticate with the Gmail API.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.