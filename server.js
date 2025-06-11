import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload audio file for voice cloning
app.post('/upload-voice', upload.single('voiceFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    
    res.json({ 
      message: 'Voice file uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload voice file' });
  }
});

// Generate speech (placeholder - would integrate with Python backend)
app.post('/generate-speech', (req, res) => {
  try {
    const { text, voiceFile, exaggeration, temperature } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // This is a placeholder response
    // In a real implementation, this would call the Python Chatterbox model
    res.json({
      message: 'Speech generation request received',
      text: text,
      voiceFile: voiceFile,
      exaggeration: exaggeration || 0.5,
      temperature: temperature || 0.8,
      // In real implementation, this would be the path to generated audio
      audioUrl: '/placeholder-audio.wav'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Get list of uploaded voice files
app.get('/voice-files', (req, res) => {
  try {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(uploadDir)
      .filter(file => file.match(/\.(wav|mp3|m4a|flac|ogg)$/i))
      .map(file => ({
        filename: file,
        path: `/uploads/${file}`,
        uploadDate: fs.statSync(path.join(uploadDir, file)).mtime
      }));
    
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get voice files' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Voice Cloner server running on http://localhost:${PORT}`);
});