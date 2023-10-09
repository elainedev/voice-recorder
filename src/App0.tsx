import React, { useState, useEffect, useRef } from 'react';

interface VoiceRecorderProps {}

// ... (previous code)

const VoiceRecorder: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let recorder: MediaRecorder | null = null;

    const handleDataAvailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    const handleStop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      setAudioBlob(blob);
    };

    const handleError = (e: Event) => {
      setError((e as ErrorEvent).error.message);
    };

    if (mediaStream) {
      recorder = new MediaRecorder(mediaStream);

      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.onerror = handleError;

      setMediaRecorder(recorder);
    }

    return () => {
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.onerror = null;
      }
      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    };
  }, [mediaStream]);

  const startRecording = () => {
    if (mediaRecorder && !recording) {
      chunksRef.current = [];
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  const reRecord = () => {
    setAudioBlob(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        <p>Sentence to be recorded: "Your specified sentence here."</p>
        <button onClick={startRecording} disabled={recording || !mediaRecorder}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording || !mediaRecorder}>
          Stop Recording
        </button>
        <button onClick={playAudio} disabled={!audioBlob}>
          Play
        </button>
        <button onClick={reRecord} disabled={!audioBlob}>
          Re-record
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;


