const fs = require('fs');
const sampleRate = 8000;
const duration = 0.5; // Short beep
const numSamples = sampleRate * duration;
const buffer = Buffer.alloc(44 + numSamples);

// Write WAV header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // PCM format length
buffer.writeUInt16LE(1, 20); // Audio format PCM
buffer.writeUInt16LE(1, 22); // Num channels
buffer.writeUInt32LE(sampleRate, 24); // Sample rate
buffer.writeUInt32LE(sampleRate, 28); // Byte rate
buffer.writeUInt16LE(1, 32); // Block align
buffer.writeUInt16LE(8, 34); // Bits per sample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples, 40);

// Generate Sine Wave
// We'll create a simple 440 Hz 'A' note beep with slight decay for nicer sound
for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const frequency = 440;
    const decay = Math.exp(-t * 5); // decay volume over time
    const value = Math.sin(t * 2 * Math.PI * frequency) * 127 * decay + 128;
    buffer.writeUInt8(Math.round(value), 44 + i);
}

fs.mkdirSync('media', { recursive: true });
fs.writeFileSync('media/alert.wav', buffer);
console.log('Successfully generated media/alert.wav');
