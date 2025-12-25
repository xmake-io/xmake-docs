#include <AL/al.h>
#include <AL/alc.h>
#include <iostream>
#include <vector>
#include <cmath>
#include <thread>
#include <chrono>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

int main() {
    // Open default device
    ALCdevice* device = alcOpenDevice(nullptr);
    if (!device) {
        std::cerr << "Failed to open default OpenAL device" << std::endl;
        return 1;
    }

    // Create context
    ALCcontext* context = alcCreateContext(device, nullptr);
    if (!context || !alcMakeContextCurrent(context)) {
        std::cerr << "Failed to create/set OpenAL context" << std::endl;
        if (context) alcDestroyContext(context);
        alcCloseDevice(device);
        return 1;
    }

    std::cout << "OpenAL initialized successfully!" << std::endl;
    std::cout << "Vendor: " << alGetString(AL_VENDOR) << std::endl;
    std::cout << "Renderer: " << alGetString(AL_RENDERER) << std::endl;
    std::cout << "Version: " << alGetString(AL_VERSION) << std::endl;

    // Generate a sine wave tone
    const int sampleRate = 44100;
    const int durationSeconds = 2;
    const int frequency = 440; // A4 note
    const int bufferSize = sampleRate * durationSeconds;
    std::vector<short> bufferData(bufferSize);

    for (int i = 0; i < bufferSize; ++i) {
        double t = (double)i / sampleRate;
        double value = std::sin(2.0 * M_PI * frequency * t);
        bufferData[i] = (short)(value * 32760); // Scale to 16-bit range
    }

    // Create buffer
    ALuint buffer;
    alGenBuffers(1, &buffer);
    alBufferData(buffer, AL_FORMAT_MONO16, bufferData.data(), bufferData.size() * sizeof(short), sampleRate);

    // Create source
    ALuint source;
    alGenSources(1, &source);
    alSourcei(source, AL_BUFFER, buffer);

    // Play sound
    std::cout << "Playing " << durationSeconds << "s sine wave tone..." << std::endl;
    alSourcePlay(source);

    // Wait until playing finishes
    ALint state;
    do {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        alGetSourcei(source, AL_SOURCE_STATE, &state);
    } while (state == AL_PLAYING);

    // Clean up
    alDeleteSources(1, &source);
    alDeleteBuffers(1, &buffer);
    alcMakeContextCurrent(nullptr);
    alcDestroyContext(context);
    alcCloseDevice(device);

    return 0;
}
