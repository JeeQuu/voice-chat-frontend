class VoiceChat {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.sessionId = 'web_' + Date.now();
        this.webhookUrl = this.getWebhookUrl();
        
        this.elements = {
            voiceBtn: document.getElementById('voiceBtn'),
            status: document.getElementById('status'),
            conversation: document.getElementById('conversation'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error')
        };
        
        this.init();
    }
    
    getWebhookUrl() {
        // For development, use localhost
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return 'http://localhost:5678/webhook/voice-chat';
        }
        
        // Production n8n webhook URL
        return 'https://n8n.jonasquant.com/webhook/voice-chat';
    }
    
    init() {
        // Check for speech recognition support
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.setupRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
        } else {
            this.showError('Speech recognition not supported in this browser. Please use Chrome, Safari, or Edge.');
            return;
        }
        
        this.elements.voiceBtn.addEventListener('click', () => this.toggleRecording());
        this.elements.voiceBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleRecording();
        });
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRecording) {
                e.preventDefault();
                this.toggleRecording();
            }
        });
        
        // Update status for mobile
        this.updateMobileStatus();
    }
    
    updateMobileStatus() {
        if (window.innerWidth <= 768) {
            this.elements.status.textContent = 'Tap microphone to start';
            const instructions = document.querySelector('.instructions');
            if (instructions) {
                instructions.textContent = 'Tap to start talking';
            }
        }
    }
    
    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'sv-SE'; // Swedish as primary, fallback to English
        
        this.recognition.onstart = () => {
            this.isRecording = true;
            this.elements.voiceBtn.classList.add('recording');
            this.elements.status.textContent = 'Listening...';
            this.elements.voiceBtn.textContent = '⏹️';
        };
        
        this.recognition.onend = () => {
            this.isRecording = false;
            this.elements.voiceBtn.classList.remove('recording');
            this.elements.voiceBtn.textContent = '🎤';
            
            if (this.elements.status.textContent === 'Listening...') {
                this.elements.status.textContent = 'Processing...';
            }
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            console.log('Recognition result:', transcript, 'Confidence:', confidence);
            
            if (confidence > 0.3) {
                this.handleVoiceInput(transcript);
            } else {
                this.showError('Could not understand clearly. Please try again.');
                this.elements.status.textContent = 'Ready to chat';
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            let errorMessage = 'Speech recognition error';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone access denied. Please allow microphone access.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access and refresh the page.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}`;
            }
            
            this.showError(errorMessage);
            this.elements.status.textContent = 'Ready to chat';
        };
    }
    
    toggleRecording() {
        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.hideError();
            
            // Request microphone permission first
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => {
                        this.recognition.start();
                    })
                    .catch((error) => {
                        console.error('Microphone access error:', error);
                        this.showError('Microphone access denied. Please allow microphone access and try again.');
                    });
            } else {
                this.recognition.start();
            }
        }
    }
    
    async handleVoiceInput(transcript) {
        this.addMessage('user', transcript);
        this.elements.status.textContent = 'Processing...';
        this.elements.loading.classList.add('active');
        
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source: 'web_voice',
                    message: transcript,
                    session_id: this.sessionId,
                    username: 'Jonas',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.addMessage('ai', data.message || 'Response received', data.audio_url);
            this.elements.status.textContent = 'Ready to chat';
            
            // Play audio response if available
            if (data.audio_url) {
                this.playAudioResponse(data.audio_url);
            }
            
        } catch (error) {
            console.error('Error:', error);
            
            let errorMessage = 'Failed to process your message.';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Connection error. Please check your internet connection and try again.';
            } else if (error.message.includes('404')) {
                errorMessage = 'Service not found. Please check the webhook configuration.';
            }
            
            this.showError(errorMessage);
            this.elements.status.textContent = 'Ready to chat';
        } finally {
            this.elements.loading.classList.remove('active');
        }
    }
    
    addMessage(type, content, audioUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'message-label';
        labelDiv.textContent = type === 'user' ? 'You:' : 'AI Assistant:';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(labelDiv);
        messageDiv.appendChild(contentDiv);
        
        if (audioUrl && type === 'ai') {
            const audioDiv = document.createElement('div');
            audioDiv.className = 'audio-player';
            
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = audioUrl;
            audio.preload = 'auto';
            
            // Auto-play on mobile with user gesture
            if (window.innerWidth <= 768) {
                audio.autoplay = true;
            }
            
            audioDiv.appendChild(audio);
            messageDiv.appendChild(audioDiv);
        }
        
        this.elements.conversation.appendChild(messageDiv);
        this.elements.conversation.scrollTop = this.elements.conversation.scrollHeight;
        
        // Animate message in
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    playAudioResponse(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        
        // Handle mobile audio playback
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Audio autoplay failed:', error);
                // On mobile, audio might need user interaction
                if (window.innerWidth <= 768) {
                    this.elements.status.textContent = 'Tap the audio player to hear the response';
                }
            });
        }
    }
    
    showError(message) {
        this.elements.error.textContent = message;
        this.elements.error.classList.add('active');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.elements.error.classList.remove('active');
    }
}

// Initialize the voice chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceChat();
});

// Handle window resize for mobile optimization
window.addEventListener('resize', () => {
    if (window.voiceChat) {
        window.voiceChat.updateMobileStatus();
    }
});

// Export for global access
window.VoiceChat = VoiceChat; 