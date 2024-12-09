# Flexible Media Recorder

A versatile, easy-to-use media recording library for JavaScript with support for both audio and video recording.

## Features

- 🎙️ Record audio and video
- ⚙️ Highly configurable
- 🌐 Browser-compatible
- 📦 TypeScript support
- 🔬 Chunk-based recording
- 📝 Comprehensive callbacks

## Installation

```bash
npm install flexible-media-recorder
```

## Basic Usage

### Audio Recording
```javascript
import FlexibleMediaRecorder from 'flexible-media-recorder';

async function recordAudio() {
  const recorder = await FlexibleMediaRecorder.create({
    mediaType: 'audio',
    onChunk: (chunkInfo) => {
      console.log('Chunk recorded:', chunkInfo);
    },
    onStop: (recordingInfo) => {
      // Handle final recording
      const audioBlob = recordingInfo.blob;
    }
  });

  recorder.start(); // Start recording
  
  // Later...
  recorder.stop(); // Stop recording
}
```

### Video Recording
```javascript
import FlexibleMediaRecorder from 'flexible-media-recorder';

async function recordVideo() {
  const recorder = await FlexibleMediaRecorder.create({
    mediaType: 'video',
    constraints: {
      video: { width: 1280, height: 720 },
      audio: true
    },
    chunkDuration: 10, // 10-second chunks
    onStop: (recordingInfo) => {
      const videoBlob = recordingInfo.blob;
    }
  });

  recorder.start();
}
```

## API Reference

### Options
- `mediaType`: 'audio' or 'video'
- `chunkDuration`: Duration of each chunk (default: 5s)
- `constraints`: Media stream constraints
- `mimeType`: Custom MIME type
- `maxDuration`: Maximum recording duration
- `onChunk`: Callback for each chunk
- `onStop`: Callback when recording stops
- `onError`: Error handling callback

## License
MIT