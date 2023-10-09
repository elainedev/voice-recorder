import React, {useEffect, useRef, useState} from 'react';
import './App.scss';

const VoiceRecorder: React.FC = () => {

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<Error | null | unknown>(null);

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
    }
  }

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  return (
    <div className='app'>
      <label className='instruction'>{`Please record the following sentence with your voice:`}</label>

      <div className='sentence-container'>
        <p className='sentence'>The quick brown fox jumps over the lazy dog.</p>
      </div>

      <button 
        className='record'
        disabled={isRecording}
        onClick={startRecording}
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
        disabled={!audioBlob}
        onClick={playAudio}
      >
        Play
      </button>

      <div className='message-container'>
        {audioBlob ? 'Audio Recorded' : 'No Audio on File'}
      </div>
      <div className='message-container'>
        {isRecording && 'Recording in Progress...'}
      </div>
      {error instanceof Error && <div className='error message-container'>
        <p>{error.message}</p>
        {error instanceof DOMException &&
          <>
            Please ensure that you
            <ul>
              <li>have enabled microphone access</li>
              <li>have refreshed the page after enabling microphone access</li>
              <li>are using the latest versions of Chrome, Firefox, or Safari</li>
            </ul>
          </>
        }
      </div>}
    </div>
  );
}

export default VoiceRecorder;


