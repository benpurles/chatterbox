# Chatterbox AI Voice Cloner

A web-based interface for the Chatterbox TTS voice cloning system. This application allows users to upload voice samples and generate speech with cloned voices.

## Features

- 🎙️ **Voice Upload**: Upload audio files to create voice profiles
- ✍️ **Text-to-Speech**: Convert any text to speech using cloned voices
- 🎭 **Voice Library**: Manage multiple voice profiles
- ⚙️ **Advanced Settings**: Control emotion, variation, and other voice parameters
- 🔊 **Audio Playback**: Listen to generated speech directly in the browser
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Current Status

This is a **frontend interface** that demonstrates the user experience for voice cloning. To make it fully functional, you'll need to:

1. **Set up the Python backend** with the Chatterbox dependencies
2. **Integrate the Python models** with the web interface
3. **Configure audio processing** for real-time generation

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## Integration with Chatterbox

To integrate with the actual Chatterbox TTS system:

1. **Install Python dependencies** from the original repository
2. **Create a Python API server** that wraps the Chatterbox models
3. **Update the `/generate-speech` endpoint** to call the Python backend
4. **Handle audio file processing** and return generated audio files

## File Structure

```
├── public/
│   ├── index.html      # Main HTML interface
│   ├── styles.css      # Styling and responsive design
│   └── script.js       # Frontend JavaScript logic
├── server.js           # Express.js server
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## API Endpoints

- `POST /upload-voice` - Upload voice sample files
- `GET /voice-files` - Get list of uploaded voices
- `POST /generate-speech` - Generate speech (placeholder)
- `GET /uploads/:filename` - Serve uploaded audio files

## Next Steps

1. **Python Integration**: Set up a Python subprocess or API to handle TTS generation
2. **Audio Processing**: Implement proper audio format handling and conversion
3. **Real-time Features**: Add streaming audio generation for longer texts
4. **Voice Management**: Add features to delete, rename, and organize voices
5. **Export Options**: Add different audio format export options

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Audio**: HTML5 Audio API
- **Styling**: Custom CSS with modern design principles

## Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

This interface is designed to work with the Chatterbox TTS system. For the core TTS functionality, refer to the original Chatterbox repository.