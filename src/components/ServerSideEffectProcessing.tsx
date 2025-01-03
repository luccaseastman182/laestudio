import React, { useState, useEffect } from 'react';

type EffectSettings = {
  [key: string]: any;
};

type ServerSideEffectProcessingProps = {
  effectName: string;
  settings: EffectSettings;
  onProcessComplete: (result: any) => void;
};

const ServerSideEffectProcessing: React.FC<ServerSideEffectProcessingProps> = ({ effectName, settings, onProcessComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processEffect = async () => {
      setProcessing(true);
      setError(null);

      try {
        const response = await fetch('/api/process-effect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ effectName, settings }),
        });

        if (!response.ok) {
          throw new Error('Failed to process effect');
        }

        const result = await response.json();
        onProcessComplete(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setProcessing(false);
      }
    };

    processEffect();
  }, [effectName, settings, onProcessComplete]);

  return (
    <div className="server-side-effect-processing">
      {processing && <p>Processing...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ServerSideEffectProcessing;
