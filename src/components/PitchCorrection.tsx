import React, { useState } from 'react';

type PitchCorrectionProps = {
  audioBuffer: AudioBuffer;
  pitch: number;
  onPitchChange: (pitch: number) => void;
};

const PitchCorrection: React.FC<PitchCorrectionProps> = ({ audioBuffer, pitch, onPitchChange }) => {
  const [currentPitch, setCurrentPitch] = useState(pitch);

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPitch = parseFloat(e.target.value);
    setCurrentPitch(newPitch);
    onPitchChange(newPitch);
  };

  return (
    <div className="pitch-correction">
      <label htmlFor="pitch">Pitch:</label>
      <input
        type="range"
        id="pitch"
        min="-12"
        max="12"
        step="0.1"
        value={currentPitch}
        onChange={handlePitchChange}
      />
      <span>{currentPitch.toFixed(1)} semitones</span>
    </div>
  );
};

export default PitchCorrection;
