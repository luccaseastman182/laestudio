import React, { useState, useEffect } from 'react';

type VSTPlugin = {
  id: number;
  name: string;
  parameters: Record<string, number>;
};

type VSTPluginSupportProps = {
  plugins: VSTPlugin[];
  onAddPlugin: (name: string) => void;
  onRemovePlugin: (id: number) => void;
  onUpdatePlugin: (id: number, parameters: Record<string, number>) => void;
};

const VSTPluginSupport: React.FC<VSTPluginSupportProps> = ({ plugins, onAddPlugin, onRemovePlugin, onUpdatePlugin }) => {
  const [newPluginName, setNewPluginName] = useState('');

  const handleAddPlugin = () => {
    if (newPluginName.trim() !== '') {
      onAddPlugin(newPluginName);
      setNewPluginName('');
    }
  };

  return (
    <div className="vst-plugin-support">
      <div className="add-plugin">
        <input
          type="text"
          value={newPluginName}
          onChange={(e) => setNewPluginName(e.target.value)}
          placeholder="New plugin name"
        />
        <button onClick={handleAddPlugin}>Add Plugin</button>
      </div>
      <div className="plugins-list">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="plugin">
            <span>{plugin.name}</span>
            <button onClick={() => onRemovePlugin(plugin.id)}>Remove</button>
            <div className="plugin-parameters">
              {Object.entries(plugin.parameters).map(([param, value]) => (
                <div key={param} className="parameter">
                  <span>{param}: {value}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onUpdatePlugin(plugin.id, { ...plugin.parameters, [param]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VSTPluginSupport;
