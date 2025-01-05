import React, { useRef, useEffect, useState } from 'react';
import { WaveformRenderer } from '@/lib/audio/waveform-renderer';
import { useAudioStore } from '@/lib/store/audio-store';

const Timeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tracks, currentTime, regions, addRegion, removeRegion } = useAudioStore();
  const [waveformRenderer, setWaveformRenderer] = useState<WaveformRenderer | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new WaveformRenderer({
        width: canvasRef.current.width,
        height: canvasRef.current.height,
        resolution: 1,
        color: '#000',
        backgroundColor: '#fff',
        waveColor: '#000',
        progressColor: '#ff5500',
        cursorColor: '#ff5500',
        gridColor: '#ddd',
        timeScale: 10,
      });
      setWaveformRenderer(renderer);
    }
  }, []);

  useEffect(() => {
    if (waveformRenderer && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        waveformRenderer.draw(ctx, currentTime, currentTime / 100);
      }
    }
  }, [waveformRenderer, currentTime]);

  const handleMarkerAdd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const time = (x / rect.width) * 100;
      addRegion(`marker-${Date.now()}`, time, time);
    }
  };

  const handleRegionSelect = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const time = (x / rect.width) * 100;
      addRegion(`region-${Date.now()}`, time, time + 10);
    }
  };

  return (
    <div className="timeline">
      <canvas ref={canvasRef} width={800} height={200} onClick={handleMarkerAdd} onDoubleClick={handleRegionSelect} />
      <div className="regions">
        {Array.from(regions.entries()).map(([id, { start, end }]) => (
          <div key={id} className="region">
            <span>{`Region: ${start.toFixed(2)} - ${end.toFixed(2)}`}</span>
            <button onClick={() => removeRegion(id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
