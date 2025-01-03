import React from 'react';

type ErrorStateProps = {
  message: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <p>{message}</p>
    </div>
  );
};

export default ErrorState;
