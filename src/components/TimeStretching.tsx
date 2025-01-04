import React, { useState } from 'react';

type TimeStretchingProps = {
  audioBuffer: AudioBuffer;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
};

const TimeStretching: React.FC<TimeStretchingProps> = ({ audioBuffer, playbackRate, onPlaybackRateChange }) => {
  const [rate, setRate] = useState(playbackRate);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    onPlaybackRateChange(newRate);
  };

  return (
    <div className="time-stretching">
      <label htmlFor="playbackRate">Playback Rate:</label>
      <input
        type="range"
        id="playbackRate"
        min="0.5"
        max="2.0"
        step="0.01"
        value={rate}
        onChange={handleRateChange}
      />
      <span>{rate.toFixed(2)}x</span>
    </div>
  );
};

export default TimeStretching;
