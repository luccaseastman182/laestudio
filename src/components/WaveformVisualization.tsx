import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

type WaveformVisualizationProps = {
  audioUrl: string;
};

const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({ audioUrl }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ff5500',
        cursorColor: '#ff5500',
        barWidth: 2,
        barHeight: 1,
        barGap: null,
        responsive: true,
      });

      waveSurferRef.current.load(audioUrl);

      return () => {
        waveSurferRef.current?.destroy();
      };
    }
  }, [audioUrl]);

  return <div ref={waveformRef} className="waveform-visualization"></div>;
};

export default WaveformVisualization;
