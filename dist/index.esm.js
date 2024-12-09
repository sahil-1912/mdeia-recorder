class FlexibleMediaRecorder {
    constructor(options = {}) {
        this.stream = null;
        this.mediaRecorder = null;
        this.chunks = [];
        this.recordingStartTime = 0;
        this.chunkStartTime = 0;
        this.handleDataAvailable = (event) => {
            var _a, _b;
            if (event.data.size > 0) {
                const chunk = event.data;
                const chunkDuration = (Date.now() - this.chunkStartTime) / 1000;
                this.chunks.push(chunk);
                (_b = (_a = this.options).onChunk) === null || _b === void 0 ? void 0 : _b.call(_a, {
                    chunk,
                    timestamp: Date.now(),
                    duration: chunkDuration,
                });
                this.chunkStartTime = Date.now();
            }
        };
        this.handleStop = () => {
            var _a, _b;
            if (!this.stream)
                return;
            this.stream.getTracks().forEach((track) => track.stop());
            const blob = new Blob(this.chunks, { type: this.options.mimeType });
            const recordingInfo = {
                blob,
                chunks: this.chunks,
                duration: (Date.now() - this.recordingStartTime) / 1000,
                mediaType: this.options.mediaType || 'audio',
            };
            (_b = (_a = this.options).onStop) === null || _b === void 0 ? void 0 : _b.call(_a, recordingInfo);
            this.chunks = [];
        };
        this.options = {
            mediaType: 'audio',
            chunkDuration: 5,
            maxDuration: Infinity,
            constraints: this.getDefaultConstraints(options.mediaType),
            mimeType: this.getDefaultMimeType(options.mediaType),
            ...options,
        };
    }
    getDefaultConstraints(mediaType = 'audio') {
        return mediaType === 'audio'
            ? { audio: true }
            : { video: true, audio: true };
    }
    getDefaultMimeType(mediaType = 'audio') {
        return mediaType === 'audio' ? 'audio/webm' : 'video/webm';
    }
    async initRecorder() {
        var _a, _b;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(this.options.constraints || this.getDefaultConstraints());
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: this.options.mimeType || this.getDefaultMimeType(),
            });
            this.mediaRecorder.ondataavailable = this.handleDataAvailable;
            this.mediaRecorder.onstop = this.handleStop;
            const controls = {
                start: () => {
                    var _a;
                    this.chunks = [];
                    this.recordingStartTime = Date.now();
                    this.chunkStartTime = Date.now();
                    (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.start((this.options.chunkDuration || 5) * 1000);
                },
                stop: () => { var _a; return (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.stop(); },
                pause: () => { var _a; return (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.pause(); },
                resume: () => { var _a; return (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.resume(); },
            };
            return controls;
        }
        catch (error) {
            (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error instanceof Error ? error : new Error('Initialization failed'));
            throw error;
        }
    }
    static async create(options) {
        const recorder = new FlexibleMediaRecorder(options);
        return recorder.initRecorder();
    }
}

export { FlexibleMediaRecorder };
