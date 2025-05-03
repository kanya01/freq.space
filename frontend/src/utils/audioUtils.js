// frontend/src/utils/audioUtils.js

/**
 * Generates waveform data from an audio file
 * @param {File} audioFile - Audio file to analyze
 * @param {number} numSamples - Number of data points to generate (default: 100)
 * @returns {Promise<Array<number>>} Array of amplitude values between 0 and 1
 */
export const generateWaveformData = (audioFile, numSamples = 100) => {
    return new Promise((resolve, reject) => {
        if (!audioFile) {
            reject(new Error('No audio file provided'));
            return;
        }

        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        // Create file reader to read audio as array buffer
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                // Decode audio data
                const audioData = await audioContext.decodeAudioData(event.target.result);

                // Get the raw PCM data (first channel only)
                const rawData = audioData.getChannelData(0);

                // Process the data to get peak values at regular intervals
                const blockSize = Math.floor(rawData.length / numSamples);
                const waveformData = [];

                for (let i = 0; i < numSamples; i++) {
                    const startIndex = i * blockSize;
                    let blockMax = 0;

                    // Find the peak value in this block
                    for (let j = 0; j < blockSize; j++) {
                        const amplitude = Math.abs(rawData[startIndex + j] || 0);
                        if (amplitude > blockMax) {
                            blockMax = amplitude;
                        }
                    }

                    // Normalize to 0-1 range and apply some minimum for visibility
                    const normalizedValue = Math.max(0.1, Math.min(blockMax * 1.5, 1));
                    waveformData.push(normalizedValue);
                }

                // Close the audio context if possible
                if (audioContext.state !== 'closed' && audioContext.close) {
                    await audioContext.close();
                }

                resolve(waveformData);
            } catch (error) {
                console.error('Error decoding audio data:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading audio file:', error);
            reject(error);
        };

        // Read the audio file as an array buffer
        reader.readAsArrayBuffer(audioFile);
    });
};

/**
 * Analyzes audio frequencies in real-time
 * @param {HTMLAudioElement} audioElement - The audio element to analyze
 * @param {number} fftSize - Size of the FFT (must be power of 2), default: 2048
 * @returns {Object} Analysis tools and cleanup function
 */
export const createAudioAnalyzer = (audioElement, fftSize = 2048) => {
    if (!audioElement) {
        throw new Error('No audio element provided');
    }

    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create analyzer
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = fftSize;

    // Create source from the audio element
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    // Buffer for frequency data
    const frequencyDataArray = new Uint8Array(analyzer.frequencyBinCount);
    // Buffer for time domain data
    const timeDataArray = new Uint8Array(analyzer.frequencyBinCount);

    // Function to get current frequency data
    const getFrequencyData = () => {
        analyzer.getByteFrequencyData(frequencyDataArray);
        return [...frequencyDataArray]; // Return a copy of the array
    };

    // Function to get current waveform data
    const getTimeData = () => {
        analyzer.getByteTimeDomainData(timeDataArray);
        return [...timeDataArray]; // Return a copy of the array
    };

    // Function to calculate the dominant frequency
    const getDominantFrequency = () => {
        const frequencies = getFrequencyData();
        let maxIndex = 0;
        let maxValue = 0;

        for (let i = 0; i < frequencies.length; i++) {
            if (frequencies[i] > maxValue) {
                maxValue = frequencies[i];
                maxIndex = i;
            }
        }

        const nyquist = audioContext.sampleRate / 2;
        const dominantFreq = maxIndex * nyquist / analyzer.frequencyBinCount;
        return dominantFreq;
    };

    // Function to calculate average amplitude
    const getAverageAmplitude = () => {
        const frequencies = getFrequencyData();
        const sum = frequencies.reduce((acc, val) => acc + val, 0);
        return sum / frequencies.length / 255; // Normalize to 0-1
    };

    // Cleanup function to disconnect and close audio context
    const cleanup = async () => {
        source.disconnect();
        analyzer.disconnect();
        if (audioContext.state !== 'closed' && audioContext.close) {
            await audioContext.close();
        }
    };

    return {
        getFrequencyData,
        getTimeData,
        getDominantFrequency,
        getAverageAmplitude,
        cleanup,
        analyzer
    };
};

/**
 * Generate a color based on audio frequency
 * @param {number} frequency - The frequency in Hz
 * @returns {string} A CSS color string (rgb or hsl)
 */
export const frequencyToColor = (frequency) => {
    // Map frequencies to hue (0-360)
    // Bass (20-250Hz): red to yellow
    // Midrange (250-4000Hz): yellow to blue
    // Treble (4000-20000Hz): blue to violet

    let hue;
    if (frequency < 250) {
        // Bass range: red to yellow (0-60)
        hue = (frequency - 20) / (250 - 20) * 60;
    } else if (frequency < 4000) {
        // Midrange: yellow to blue (60-240)
        hue = 60 + (frequency - 250) / (4000 - 250) * 180;
    } else {
        // Treble range: blue to violet (240-300)
        hue = 240 + (frequency - 4000) / (20000 - 4000) * 60;
    }

    // Ensure hue is in the valid range
    hue = Math.max(0, Math.min(Math.round(hue), 360));

    return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Maps audio amplitude to a size value
 * @param {number} amplitude - Amplitude value between 0 and 1
 * @param {number} minSize - Minimum size (default: 1)
 * @param {number} maxSize - Maximum size (default: 10)
 * @returns {number} Size value
 */
export const amplitudeToSize = (amplitude, minSize = 1, maxSize = 10) => {
    return minSize + amplitude * (maxSize - minSize);
};