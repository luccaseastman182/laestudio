import React, { useState } from 'react';

type ExportOptionsProps = {
  onExport: (format: string, quality: number) => void;
};

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport }) => {
  const [format, setFormat] = useState('mp3');
  const [quality, setQuality] = useState(128);

  const handleExport = () => {
    onExport(format, quality);
  };

  return (
    <div className="export-options">
      <div className="format-selection">
        <label htmlFor="format">Format:</label>
        <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
          <option value="flac">FLAC</option>
        </select>
      </div>
      <div className="quality-selection">
        <label htmlFor="quality">Quality:</label>
        <input
          type="number"
          id="quality"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          min="64"
          max="320"
        />
      </div>
      <button onClick={handleExport}>Export</button>
    </div>
  );
};

export default ExportOptions;
