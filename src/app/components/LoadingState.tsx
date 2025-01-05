import React from 'react';

type LoadingStateProps = {
  message: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
