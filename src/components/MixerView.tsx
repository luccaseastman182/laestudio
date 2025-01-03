import React, { useState } from 'react';

type Track = {
  id: number;
  name: string;
  volume: number;
  pan: number;
};

type MixerViewProps = {
  tracks: Track[];
  onVolumeChange: (id: number, volume: number) => void;
  onPanChange: (id: number, pan: number) => void;
};

const MixerView: React.FC<MixerViewProps> = ({ tracks, onVolumeChange, onPanChange }) => {
  return (
    <div className="mixer-view">
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <span>{track.name}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={track.volume}
            onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
          />
          <input
            type="range"
            min="-50"
            max="50"
            value={track.pan}
            onChange={(e) => onPanChange(track.id, Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
};

export default MixerView;
