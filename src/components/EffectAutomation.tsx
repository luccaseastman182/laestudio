import React, { useState } from 'react';

type AutomationPoint = {
  time: number;
  value: number;
};

type EffectAutomationProps = {
  points: AutomationPoint[];
  onAddPoint: (point: AutomationPoint) => void;
  onRemovePoint: (index: number) => void;
  onUpdatePoint: (index: number, point: AutomationPoint) => void;
};

const EffectAutomation: React.FC<EffectAutomationProps> = ({ points, onAddPoint, onRemovePoint, onUpdatePoint }) => {
  const [newPoint, setNewPoint] = useState<AutomationPoint>({ time: 0, value: 0 });

  const handleAddPoint = () => {
    onAddPoint(newPoint);
    setNewPoint({ time: 0, value: 0 });
  };

  return (
    <div className="effect-automation">
      <div className="add-point">
        <input
          type="number"
          value={newPoint.time}
          onChange={(e) => setNewPoint({ ...newPoint, time: Number(e.target.value) })}
          placeholder="Time"
        />
        <input
          type="number"
          value={newPoint.value}
          onChange={(e) => setNewPoint({ ...newPoint, value: Number(e.target.value) })}
          placeholder="Value"
        />
        <button onClick={handleAddPoint}>Add Point</button>
      </div>
      <div className="points-list">
        {points.map((point, index) => (
          <div key={index} className="point">
            <span>Time: {point.time}</span>
            <span>Value: {point.value}</span>
            <button onClick={() => onRemovePoint(index)}>Remove</button>
            <button onClick={() => onUpdatePoint(index, point)}>Update</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectAutomation;
