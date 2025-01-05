import React, { useState } from 'react';

type EffectPreset = {
  id: number;
  name: string;
  settings: Record<string, unknown>;
};

type EffectPresetsProps = {
  presets: EffectPreset[];
  onAddPreset: (name: string, settings: Record<string, unknown>) => void;
  onRemovePreset: (id: number) => void;
  onApplyPreset: (id: number) => void;
};

const EffectPresets: React.FC<EffectPresetsProps> = ({ presets, onAddPreset, onRemovePreset, onApplyPreset }) => {
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetSettings, setNewPresetSettings] = useState<Record<string, unknown>>({});

  const handleAddPreset = () => {
    if (newPresetName.trim() !== '') {
      onAddPreset(newPresetName, newPresetSettings);
      setNewPresetName('');
      setNewPresetSettings({});
    }
  };

  return (
    <div className="effect-presets">
      <div className="add-preset">
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="New preset name"
        />
        <button onClick={handleAddPreset}>Add Preset</button>
      </div>
      <div className="presets-list">
        {presets.map((preset) => (
          <div key={preset.id} className="preset">
            <span>{preset.name}</span>
            <button onClick={() => onApplyPreset(preset.id)}>Apply</button>
            <button onClick={() => onRemovePreset(preset.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectPresets;
