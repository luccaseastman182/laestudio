import React, { useState } from 'react';

type Effect = {
  id: number;
  name: string;
  isActive: boolean;
};

type PluginRackProps = {
  effects: Effect[];
  onToggleEffect: (id: number) => void;
  onAddEffect: (name: string) => void;
  onRemoveEffect: (id: number) => void;
};

const PluginRack: React.FC<PluginRackProps> = ({ effects, onToggleEffect, onAddEffect, onRemoveEffect }) => {
  const [newEffectName, setNewEffectName] = useState('');

  const handleAddEffect = () => {
    if (newEffectName.trim() !== '') {
      onAddEffect(newEffectName);
      setNewEffectName('');
    }
  };

  return (
    <div className="plugin-rack">
      <div className="add-effect">
        <input
          type="text"
          value={newEffectName}
          onChange={(e) => setNewEffectName(e.target.value)}
          placeholder="New effect name"
        />
        <button onClick={handleAddEffect}>Add Effect</button>
      </div>
      <div className="effects-list">
        {effects.map((effect) => (
          <div key={effect.id} className="effect">
            <span>{effect.name}</span>
            <button onClick={() => onToggleEffect(effect.id)}>
              {effect.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => onRemoveEffect(effect.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PluginRack;
