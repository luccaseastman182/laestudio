import React, { useState } from 'react';

type Track = {
  id: number;
  name: string;
  isMuted: boolean;
  isSolo: boolean;
};

type TrackListProps = {
  tracks: Track[];
  onMuteToggle: (id: number) => void;
  onSoloToggle: (id: number) => void;
};

const TrackList: React.FC<TrackListProps> = ({ tracks, onMuteToggle, onSoloToggle }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <span>{track.name}</span>
          <button onClick={() => onMuteToggle(track.id)}>
            {track.isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={() => onSoloToggle(track.id)}>
            {track.isSolo ? 'Unsolo' : 'Solo'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
