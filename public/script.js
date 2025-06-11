class VoiceCloner {
    constructor() {
        this.selectedVoiceFile = null;
        this.uploadedVoices = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadVoiceLibrary();
        this.updateGenerateButton();
    }

    setupEventListeners() {
        // File upload
        const voiceFile = document.getElementById('voiceFile');
        const uploadArea = document.getElementById('uploadArea');

        voiceFile.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.uploadFile(files[0]);
            }
        });

        uploadArea.addEventListener('click', () => {
            voiceFile.click();
        });

        // Text input
        const textInput = document.getElementById('textInput');
        textInput.addEventListener('input', () => {
            this.updateCharCounter();
            this.updateGenerateButton();
        });

        // Settings sliders
        this.setupSliders();

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateSpeech();
        });
    }

    setupSliders() {
        const sliders = ['exaggeration', 'temperature', 'cfgWeight'];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(sliderId + 'Value');
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            await this.uploadFile(file);
        }
    }

    async uploadFile(file) {
        // Validate file type
        if (!file.type.startsWith('audio/')) {
            this.showStatus('Please select an audio file', 'error');
            return;
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            this.showStatus('File size must be less than 50MB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('voiceFile', file);

        const uploadStatus = document.getElementById('uploadStatus');
        uploadStatus.style.display = 'block';
        uploadStatus.className = 'upload-status';
        uploadStatus.textContent = 'Uploading...';

        try {
            const response = await fetch('/upload-voice', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                uploadStatus.className = 'upload-status success';
                uploadStatus.textContent = `✅ ${file.name} uploaded successfully!`;
                
                this.selectedVoiceFile = result.filename;
                this.loadVoiceLibrary();
                this.updateGenerateButton();
                this.showStatus('Voice uploaded successfully!', 'success');
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            uploadStatus.className = 'upload-status error';
            uploadStatus.textContent = `❌ Upload failed: ${error.message}`;
            this.showStatus('Upload failed: ' + error.message, 'error');
        }
    }

    async loadVoiceLibrary() {
        try {
            const response = await fetch('/voice-files');
            const voices = await response.json();
            
            this.uploadedVoices = voices;
            this.renderVoiceLibrary();
        } catch (error) {
            console.error('Failed to load voice library:', error);
        }
    }

    renderVoiceLibrary() {
        const voiceList = document.getElementById('voiceList');
        
        if (this.uploadedVoices.length === 0) {
            voiceList.innerHTML = '<p class="no-voices">No voices uploaded yet</p>';
            return;
        }

        voiceList.innerHTML = this.uploadedVoices.map(voice => `
            <div class="voice-item ${voice.filename === this.selectedVoiceFile ? 'selected' : ''}" 
                 onclick="voiceCloner.selectVoice('${voice.filename}')">
                <div class="voice-name">${voice.filename}</div>
                <div class="voice-date">${new Date(voice.uploadDate).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    selectVoice(filename) {
        this.selectedVoiceFile = filename;
        this.renderVoiceLibrary();
        this.updateGenerateButton();
        this.showStatus(`Selected voice: ${filename}`, 'info');
    }

    updateCharCounter() {
        const textInput = document.getElementById('textInput');
        const charCount = document.getElementById('charCount');
        charCount.textContent = textInput.value.length;
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        const textInput = document.getElementById('textInput');
        
        const hasText = textInput.value.trim().length > 0;
        const hasVoice = this.selectedVoiceFile !== null;
        
        generateBtn.disabled = !(hasText && hasVoice);
    }

    async generateSpeech() {
        const generateBtn = document.getElementById('generateBtn');
        const btnText = generateBtn.querySelector('.btn-text');
        const btnLoading = generateBtn.querySelector('.btn-loading');
        
        // Show loading state
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        try {
            const textInput = document.getElementById('textInput');
            const exaggeration = document.getElementById('exaggeration').value;
            const temperature = document.getElementById('temperature').value;
            const cfgWeight = document.getElementById('cfgWeight').value;

            const requestData = {
                text: textInput.value.trim(),
                voiceFile: this.selectedVoiceFile,
                exaggeration: parseFloat(exaggeration),
                temperature: parseFloat(temperature),
                cfgWeight: parseFloat(cfgWeight)
            };

            const response = await fetch('/generate-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showStatus('Speech generated successfully!', 'success');
                this.displayGeneratedAudio(result);
            } else {
                throw new Error(result.error || 'Generation failed');
            }
        } catch (error) {
            this.showStatus('Generation failed: ' + error.message, 'error');
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            this.updateGenerateButton();
        }
    }

    displayGeneratedAudio(result) {
        const outputSection = document.getElementById('outputSection');
        const audioPlayer = document.getElementById('audioPlayer');
        
        // Note: In a real implementation, result.audioUrl would be the actual audio file
        // For now, we'll show a placeholder
        outputSection.style.display = 'block';
        
        // Scroll to the output section
        outputSection.scrollIntoView({ behavior: 'smooth' });
        
        this.showStatus('⚠️ This is a demo interface. Audio generation requires Python backend setup.', 'info');
    }

    showStatus(message, type = 'info') {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 5000);
    }
}

// Global functions for button clicks
function downloadAudio() {
    voiceCloner.showStatus('Download functionality would be implemented with the Python backend', 'info');
}

function shareAudio() {
    voiceCloner.showStatus('Share functionality would be implemented with the Python backend', 'info');
}

// Initialize the voice cloner when the page loads
let voiceCloner;
document.addEventListener('DOMContentLoaded', () => {
    voiceCloner = new VoiceCloner();
});