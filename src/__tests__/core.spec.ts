import { FlexibleMediaRecorder } from '../core';

describe('FlexibleMediaRecorder', () => {
    test('should initialize correctly', async () => {
        const recorder = await FlexibleMediaRecorder.create({
            mediaType: 'audio'
        });

        expect(typeof recorder.start).toBe('function');
        expect(typeof recorder.stop).toBe('function');
    });
});
