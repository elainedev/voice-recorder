import React, {useEffect, useState} from 'react';
import AudioVisualizer from './components/AudioVisualizer';
import ErrorInstruction from './components/ErrorInstruction';
import './App.scss';

const VoiceRecorder: React.FC = () => {

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>();
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<Error | null | unknown>();
  const [secondsRemaining, setSecondsRemaining] = useState<number | string | null>();
  const [hasCountdown, setHasCountdown] = useState<boolean>(false);

  useEffect(() => {

    // request mic access
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream: MediaStream) => {
        setMediaRecorder(new MediaRecorder(stream));
        setIsRecording(false);
        setError(null);
      })
      .catch((error: Error) => {
        setError(error)
      });
  }, []);

  useEffect(() => {
    if (mediaRecorder) {
      let chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event : BlobEvent) => {
        if (event.data.size) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {type: 'audio/wav'});
        setAudioBlob(blob);
        chunks = [];
      }
    }
  }, [mediaRecorder])

  const startCountdown = () => {
    setIsCountingDown(true);
    let seconds = 3;

    const audioContext = new (window.AudioContext)();


    const countdownInterval = setInterval(() => {
      setSecondsRemaining(seconds--);

      if (seconds >= 0) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }

      if (seconds < 0) {
        clearInterval(countdownInterval);
        setIsCountingDown(false);
        setSecondsRemaining('Speak')
        startRecording();
      }
    }, 1000);
  }

  const startRecording = () => {
    try {
      if (mediaRecorder && !isRecording) {
        mediaRecorder.start();
        setIsRecording(true);
      }
    }
    catch (error: unknown) {
      setError(error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setSecondsRemaining(null);
    }
  }

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  const generateStatusMessage = () => {
    if (isRecording) {
      return 'Recording in Progress...';
    }
    else if (audioBlob) {
      return 'Audio Recorded.';
    }
    return 'No Audio Recording on File.'
  }

  return (
    <div className='app'>
      <label className='instruction'>{`Please record the following sentence with your voice:`}</label>

      <div className='sentence-container'>
        <p className='sentence'>This voice recording app is pretty dope.</p>
      </div>

      <div className='text-container checkbox'>
        <input type='checkbox' id='toggle-timer' disabled={isRecording} name='toggle-timer' onChange={() => setHasCountdown(!hasCountdown)} />
        <label htmlFor='toggle-timer'>Enable 3-second countdown prior to recording</label>
      </div>

      <button 
        className='record'
        disabled={isRecording || isCountingDown}
        onClick={hasCountdown ? startCountdown : startRecording}
      >
        {audioBlob ? 'Re-Record' : 'Start Recording'}
      </button>

      <button 
        className='stop'
        disabled={!isRecording}
        onClick={stopRecording}
      >
        Stop Recording
      </button>

      <button 
        className='play'
        disabled={!audioBlob || isRecording}
        onClick={playAudio}
      >
        Play
      </button>

      
      <div className='text-container center'>
        {generateStatusMessage()}
      </div>
      {hasCountdown && <div className='countdown-outer-container center'>
        {isCountingDown && <div className='spinner' />}
        
        <div className='countdown-inner-container center'>
          {secondsRemaining}
        </div>
      </div>}

      {audioBlob && <AudioVisualizer audioBlob={audioBlob} />}
      
      {error instanceof Error && <div className='error text-container'>
        <p>{error.message}</p>
        {error instanceof DOMException &&
          <ErrorInstruction />
        }
      </div>}
    </div>
  );
}

export default VoiceRecorder;


