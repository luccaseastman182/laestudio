import React, { useState } from 'react';

type UndoRedoProps = {
  onUndo: () => void;
  onRedo: () => void;
};

const UndoRedo: React.FC<UndoRedoProps> = ({ onUndo, onRedo }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleUndo = () => {
    if (canUndo) {
      onUndo();
      setCanUndo(false);
      setCanRedo(true);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      onRedo();
      setCanRedo(false);
      setCanUndo(true);
    }
  };

  return (
    <div className="undo-redo">
      <button onClick={handleUndo} disabled={!canUndo}>Undo</button>
      <button onClick={handleRedo} disabled={!canRedo}>Redo</button>
    </div>
  );
};

export default UndoRedo;
