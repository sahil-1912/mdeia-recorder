import {
  MediaType,
  RecorderOptions,
  RecordingInfo,
  ChunkInfo,
  RecorderControls,
} from './types';

export class WebMediaRecorder {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private chunkStartTime: number = 0;
  private options: RecorderOptions;

  constructor(options: RecorderOptions = {}) {
    this.options = {
      mediaType: 'audio',
      chunkDuration: 5,
      maxDuration: Infinity,
      constraints: this.getDefaultConstraints(options.mediaType),
      mimeType: this.getDefaultMimeType(options.mediaType),
      ...options,
    };
  }

  private getDefaultConstraints(mediaType: MediaType = 'audio'): MediaStreamConstraints {
    return mediaType === 'audio'
      ? { audio: true }
      : { video: true, audio: true };
  }

  private getDefaultMimeType(mediaType: MediaType = 'audio'): string {
    return mediaType === 'audio' ? 'audio/webm' : 'video/webm';
  }

  private handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      const chunk = event.data;
      const chunkDuration = (Date.now() - this.chunkStartTime) / 1000;

      this.chunks.push(chunk);

      this.options.onChunk?.({
        chunk,
        timestamp: Date.now(),
        duration: chunkDuration,
      });

      this.chunkStartTime = Date.now();
    }
  };

  private handleStop = () => {
    if (!this.stream) return;

    this.stream.getTracks().forEach((track) => track.stop());
    const blob = new Blob(this.chunks, { type: this.options.mimeType });
    const recordingInfo: RecordingInfo = {
      blob,
      chunks: this.chunks,
      duration: (Date.now() - this.recordingStartTime) / 1000,
      mediaType: this.options.mediaType || 'audio',
    };

    this.options.onStop?.(recordingInfo);
    this.chunks = [];
  };

  public async initRecorder(): Promise<RecorderControls> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(
        this.options.constraints || this.getDefaultConstraints()
      );

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType || this.getDefaultMimeType(),
      });

      this.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.mediaRecorder.onstop = this.handleStop;

      const controls: RecorderControls = {
        start: () => {
          this.chunks = [];
          this.recordingStartTime = Date.now();
          this.chunkStartTime = Date.now();
          this.mediaRecorder?.start((this.options.chunkDuration || 5) * 1000);
        },
        stop: () => this.mediaRecorder?.stop(),
        pause: () => this.mediaRecorder?.pause(),
        resume: () => this.mediaRecorder?.resume(),
      };

      return controls;
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Initialization failed')
      );
      throw error;
    }
  }

  public static async create(options?: RecorderOptions): Promise<RecorderControls> {
    const recorder = new WebMediaRecorder(options);
    return recorder.initRecorder();
  }
}
