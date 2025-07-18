# 🎤 Jonas Voice Chat Frontend

A modern voice-to-voice chat interface for Jonas's AI Assistant, built with vanilla JavaScript and optimized for mobile devices.

## ✨ Features

- **Voice Recognition** - Uses Web Speech API for speech-to-text
- **Voice Synthesis** - Integrates with ElevenLabs for natural AI responses
- **Mobile Optimized** - Touch-friendly interface with responsive design
- **Real-time Chat** - Instant communication with AI assistant
- **Error Handling** - Graceful error handling and user feedback
- **Cross-browser** - Works on Chrome, Safari, Edge, and mobile browsers

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jonas-voice-chat.git
   cd jonas-voice-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Access your deployed app**
   ```
   https://your-project-name.vercel.app
   ```

## 🔧 Configuration

### n8n Webhook Configuration

Update the webhook URL in `script.js`:

```javascript
getWebhookUrl() {
    // Update this with your n8n webhook URL
    return 'https://your-n8n-instance.com/webhook/voice-chat';
}
```

### ElevenLabs Setup

Make sure your n8n workflow has the correct ElevenLabs credentials:
- **API Key**: Your ElevenLabs API key
- **Voice ID**: Your chosen voice ID

## 📱 Mobile Usage

### iOS Safari
- Allow microphone access when prompted
- Tap the microphone button to start recording
- Audio responses will auto-play after user interaction

### Android Chrome
- Grant microphone permission
- Tap to record voice messages
- Audio controls appear for AI responses

## 🛠️ Development

### File Structure
```
voice-chat-frontend/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Voice chat logic
├── package.json        # Dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Key Components

#### VoiceChat Class
- Handles speech recognition
- Manages UI state
- Processes API responses
- Handles audio playback

#### Speech Recognition
- Uses Web Speech API
- Supports Swedish (sv-SE) and English fallback
- Confidence-based filtering
- Error handling for various scenarios

#### Audio Processing
- ElevenLabs integration via n8n
- Base64 audio data handling
- Mobile-optimized playback
- Auto-play with user gesture support

## 🔒 Security & Privacy

- No data stored locally
- All communication via secure HTTPS
- Voice data processed through established APIs
- No tracking or analytics

## 🐛 Troubleshooting

### Common Issues

**Microphone not working**
- Check browser permissions
- Ensure HTTPS connection
- Try refreshing the page

**Audio not playing**
- Check device volume
- Ensure audio is enabled
- Try tapping the audio player manually

**Connection errors**
- Verify n8n webhook URL
- Check internet connection
- Ensure CORS is configured properly

### Browser Compatibility

✅ **Supported Browsers**
- Chrome 60+
- Safari 14+
- Edge 80+
- Firefox 78+
- Mobile browsers (iOS Safari, Android Chrome)

❌ **Not Supported**
- Internet Explorer
- Older mobile browsers
- Browsers without Web Speech API

## 🔄 API Integration

### Request Format
```javascript
{
    "source": "web_voice",
    "message": "transcribed text",
    "session_id": "unique_session_id",
    "username": "Jonas",
    "timestamp": "ISO_timestamp"
}
```

### Response Format
```javascript
{
    "message": "AI response text",
    "audio_url": "base64_audio_data",
    "timestamp": "ISO_timestamp"
}
```

## 📈 Performance

- **Lightweight** - No external dependencies
- **Fast Loading** - Optimized for mobile networks
- **Efficient** - Minimal resource usage
- **Scalable** - Can handle multiple concurrent users

## 🎨 Customization

### Styling
Edit `style.css` to customize:
- Colors and gradients
- Button sizes and animations
- Typography and spacing
- Mobile breakpoints

### Voice Settings
Modify `script.js` to change:
- Speech recognition language
- Confidence thresholds
- Audio playback settings
- Error handling behavior

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify n8n webhook configuration
3. Test with different browsers
4. Check browser console for errors

## 🔮 Future Enhancements

- [ ] Voice activity detection
- [ ] Custom wake words
- [ ] Multi-language support
- [ ] Conversation history
- [ ] Voice command shortcuts
- [ ] Offline mode
- [ ] Push notifications
- [ ] Integration with other services

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Built with ❤️ for Jonas's AI Assistant ecosystem** 