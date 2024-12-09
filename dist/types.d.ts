export declare type MediaType = 'audio' | 'video';
export interface RecorderOptions {
    mediaType?: MediaType;
    chunkDuration?: number;
    constraints?: MediaStreamConstraints;
    mimeType?: string;
    maxDuration?: number;
    onChunk?: (chunkInfo: ChunkInfo) => void;
    onStop?: (recordingInfo: RecordingInfo) => void;
    onError?: (error: Error) => void;
}
export interface ChunkInfo {
    chunk: Blob;
    timestamp: number;
    duration: number;
}
export interface RecordingInfo {
    blob: Blob;
    chunks: Blob[];
    duration: number;
    mediaType: MediaType;
}
export interface RecorderControls {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
}
