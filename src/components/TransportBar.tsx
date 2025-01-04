import React, { useState } from 'react';

type TransportBarProps = {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};

const TransportBar: React.FC<TransportBarProps> = ({ onPlay, onPause, onStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause();
  };

  const handleStop = () => {
    setIsPlaying(false);
    onStop();
  };

  return (
    <div className="transport-bar">
      <button onClick={handlePlay} disabled={isPlaying}>Play</button>
      <button onClick={handlePause} disabled={!isPlaying}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TransportBar;
