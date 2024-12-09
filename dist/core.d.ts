import { RecorderOptions, RecorderControls } from './types';
export declare class FlexibleMediaRecorder {
    private stream;
    private mediaRecorder;
    private chunks;
    private recordingStartTime;
    private chunkStartTime;
    private options;
    constructor(options?: RecorderOptions);
    private getDefaultConstraints;
    private getDefaultMimeType;
    private handleDataAvailable;
    private handleStop;
    initRecorder(): Promise<RecorderControls>;
    static create(options?: RecorderOptions): Promise<RecorderControls>;
}
