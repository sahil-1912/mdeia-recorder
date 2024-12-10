import { WebMediaRecorder } from '../core'

describe('WebMediaRecorder', () => {
    test('should initialize correctly', async () => {
        const recorder = await WebMediaRecorder.create({
            mediaType: 'audio'
        });

        expect(typeof recorder.start).toBe('function');
        expect(typeof recorder.stop).toBe('function');
    });
});
