import React, { useState } from 'react';

type ServerActionProps = {
  onUpload: (file: File) => void;
  onDownload: (filename: string) => void;
};

const ServerActions: React.FC<ServerActionProps> = ({ onUpload, onDownload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  const handleDownload = () => {
    if (filename.trim() !== '') {
      onDownload(filename);
      setFilename('');
    }
  };

  return (
    <div className="server-actions">
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div className="download-section">
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename"
        />
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default ServerActions;
