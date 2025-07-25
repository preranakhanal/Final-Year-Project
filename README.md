# Final Year Project - PhishShield

A comprehensive phishing detection system that includes a browser extension, machine learning models, and an interactive chatbot for cybersecurity education.

## 🎯 Project Overview

PhishShield is a multi-component cybersecurity solution designed to protect users from phishing attacks through:
- **Browser Extension**: Real-time email analysis in Gmail
- **Machine Learning Models**: Advanced phishing detection algorithms
- **Educational Chatbot**: Interactive learning platform for cybersecurity awareness

## 🏗️ Project Structure

```
Final-Year-Project/
├── extension/              # Browser Extension
│   └── extension/
│       ├── src/
│       │   ├── background/     # Background scripts
│       │   ├── components/     # React components
│       │   ├── content/        # Content scripts
│       │   ├── gmail/          # Gmail API integration
│       │   ├── ml/             # ML integration
│       │   └── popup/          # Extension popup
│       ├── public/             # Built extension files
│       └── package.json
│
├── ml_training/            # Machine Learning Models
│   └── ml_training/
│       ├── dataset/            # Training datasets
│       ├── model/              # Trained models
│       └── *.ipynb             # Jupyter notebooks
│
├── phish-shield-bot/       # Frontend Chatbot
│   └── phish-shield-bot/
│       ├── app/                # Next.js app directory
│       ├── components/         # React components
│       └── lib/                # Utilities and hooks
│
└── phish-shield-bot-backend/  # Backend API
    └── phish-shield-bot-backend/
        └── chatbot_project/    # Django project
            ├── chat/           # Chat application
            └── ml/             # ML integration
```

## 🚀 Features

### Browser Extension
- **Real-time Email Analysis**: Analyzes emails in Gmail for phishing indicators
- **ML-powered Detection**: Uses trained models to identify suspicious content
- **User-friendly Alerts**: Clear warnings and safety confirmations
- **Non-intrusive Interface**: Seamless integration with Gmail

### Machine Learning Models
- **Email Content Analysis**: Text-based phishing detection
- **Feature Engineering**: Advanced preprocessing and feature extraction
- **Multiple Algorithms**: Comparison of different ML approaches
- **High Accuracy**: Trained on comprehensive phishing datasets

### Educational Chatbot
- **Interactive Learning**: Engaging conversations about cybersecurity
- **Phishing Education**: Teaches users how to identify threats
- **Real-time Responses**: Instant answers to security questions
- **Modern UI**: Clean and intuitive interface

## 🛠️ Technology Stack

### Browser Extension
- **TypeScript/JavaScript**: Core development language
- **React**: UI components and state management
- **Webpack**: Module bundling and build process
- **Chrome Extension APIs**: Browser integration

### Machine Learning
- **Python**: Primary development language
- **Scikit-learn**: ML algorithms and preprocessing
- **Pandas/NumPy**: Data manipulation and analysis
- **Jupyter Notebooks**: Model development and experimentation

### Chatbot Frontend
- **Next.js**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **WebSocket**: Real-time communication

### Backend API
- **Django**: Web framework
- **Django Channels**: WebSocket support
- **Python**: Server-side development
- **SQLite**: Database storage

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Chrome/Chromium browser

### Browser Extension
```bash
cd extension/extension
npm install
npm run build
```

### Machine Learning Models
```bash
cd ml_training/ml_training
pip install -r requirements.txt
jupyter notebook
```

### Chatbot Frontend
```bash
cd phish-shield-bot/phish-shield-bot
npm install
npm run dev
```

### Backend API
```bash
cd phish-shield-bot-backend/phish-shield-bot-backend/chatbot_project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🔧 Usage

### Loading the Browser Extension
1. Build the extension using the commands above
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension/extension/public` folder
5. The extension will appear in your browser toolbar

### Training ML Models
1. Open the Jupyter notebooks in the `ml_training` directory
2. Follow the step-by-step instructions in each notebook
3. Models will be saved for use in the extension

### Running the Chatbot
1. Start the backend server
2. Start the frontend development server
3. Access the chatbot at `http://localhost:3000`

## 📊 Model Performance

The machine learning models have been trained and evaluated on comprehensive phishing datasets, achieving:
- **High Accuracy**: >95% detection rate
- **Low False Positives**: Minimal legitimate email flagging
- **Real-time Processing**: Fast analysis suitable for browser integration

## 🤝 Contributing

This is an academic project for Final Year Project. For educational purposes and further development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for academic purposes as part of a Final Year Project.

## 👥 Authors

- **Prerana Khanal** - Project Developer

## 🙏 Acknowledgments

- Academic supervisors and mentors
- Open-source community for tools and libraries
- Cybersecurity research community for datasets and methodologies

---

**Note**: This project is developed for educational and research purposes. Always follow responsible disclosure practices when dealing with cybersecurity research.
