import React, {useEffect, useRef, useState} from 'react';
import './App.scss';

const VoiceRecorder: React.FC = () => {



  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  useEffect(() => {

    console.log(navigator)
    // request mic access
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream: MediaStream) => {
        setMediaRecorder(new MediaRecorder(stream));
        setIsRecording(false);
        setError(null);
      })
      .catch((error: Error) => setError(error.message));
  }, []);

  useEffect(() => {
    if (mediaRecorder) {
      let chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event : BlobEvent) => {
        console.log('ev', event);
        if (event.data.size) {
          chunks.push(event.data);
        }
        console.log('chunks', chunks)
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {type: 'audio/wav'});
        console.log('blob', blob);
        setAudioBlob(blob);
        chunks = [];
      }
    }
  }, [mediaRecorder])

  const startRecording = () => {
    if (mediaRecorder && !isRecording) {
      mediaRecorder.start();
      setIsRecording(true);
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
      <label className='instruction'>{`Howdy, please record the following sentence with your voice:`}</label>

      <div className='sentence-container'>
        <p className='sentence'>The quick brown fox jumps over the lazy dog.</p>
      </div>

      <button 
        className='record'
        disabled={isRecording}
        onClick={startRecording}
      >
        {audioBlob ? 'Re-Record' : 'Record'}
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
    </div>
  );
}

export default VoiceRecorder;


