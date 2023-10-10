# Voice Recorder App

## Instructions
Visit [https://elainedev.github.io/voice-recorder/](https://elainedev.github.io/voice-recorder/) to see the project in action on GitHub Pages!

Alternatively:
1. git clone into project directory
2. cd into project directory (`main` branch)
3. run `npm i`
4. run `npm run dev`
5. copy and paste the localhost url displayed in the terminal into your browser (the url should be http://localhost:5173/voice-recorder/).

**Demo Video:** See the demo video [here](https://drive.google.com/file/d/1I01BhJzvZBPyUH8aSKiasHHqzhfjIbPN/view?usp=sharing).


## Objective:
A React component that allows users to record themselves saying a specified sentence using the MediaStream Recording API. The component allows users to listen to their recorded voice after recording, and optionally re-record if the user is not satisfied.

## Requirements:

### User Interface:

- An area displaying the sentence to be recorded.
- A "Start Recording" button to begin the recording.
- A "Stop Recording" button to end the recording. This button is only enabled when recording is in progress.
- A "Play" button to listen to the recorded audio. This button is only enabled after a successful recording.
- A "Re-record" button to allow users to try recording the sentence again. This button is only enabled after a successful recording.

### Functionality:

- The component utilizes the MediaStream Recording API to capture the user's voice.
- Only one recording session can occur at a time.
- After recording, the audio is saved in a format that can be played back in modern browsers (e.g., .wav or .webm).
- When the "Play" button is clicked, the recorded audio is played back to the user.
- The "Re-record" button should discard the previous recording and allow the user to start a new recording session.

### Error Handling:

- The component handles potential errors, such as when the user denies microphone access, by displaying relevant error messages and instructions.


### Bonus

- A visual representation (e.g., a waveform) of the recorded audio.
- An optional countdown timer that counts down from 3 seconds before starting the recording, giving the user a heads-up.
