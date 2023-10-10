import React, { useEffect, useRef } from 'react';
import './AudioVisualizer.scss';

type AudioVisualizerProps = {
  audioBlob: Blob;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioBlob }) => {
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const drawWavefrom = async () => {
      const audioContext = new (window.AudioContext)();

      const audioBuffer = await audioContext.decodeAudioData(
        await audioBlob.arrayBuffer()
      );
      const data = audioBuffer.getChannelData(0);

      const canvas = canvasRef.current;

      if (canvas) {
        const canvasContext = canvas.getContext('2d');

        if (canvasContext) {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          const step = Math.ceil(data.length / canvas.width);
          const amp = canvas.height /2;

          for (let i = 0; i < canvas.width; i++) {
            let min = Infinity;
            let max = -Infinity;

            for (let j = 0; j < step; j++) {
              const datum = data[(i * step) + j];
              min = Math.min(datum, min);
              max = Math.max(datum, max);
            }

            canvasContext.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
          }
        }
      }
    
    }

    drawWavefrom();
  }, [audioBlob]);

  return <canvas ref={canvasRef} />
};

export default AudioVisualizer;
