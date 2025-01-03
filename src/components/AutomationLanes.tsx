import React, { useState } from 'react';

type AutomationLaneProps = {
  parameter: string;
  points: { time: number; value: number }[];
  onAddPoint: (point: { time: number; value: number }) => void;
  onRemovePoint: (index: number) => void;
  onUpdatePoint: (index: number, point: { time: number; value: number }) => void;
};

const AutomationLane: React.FC<AutomationLaneProps> = ({ parameter, points, onAddPoint, onRemovePoint, onUpdatePoint }) => {
  const [newPoint, setNewPoint] = useState({ time: 0, value: 0 });

  const handleAddPoint = () => {
    onAddPoint(newPoint);
    setNewPoint({ time: 0, value: 0 });
  };

  return (
    <div className="automation-lane">
      <h3>{parameter}</h3>
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

export default AutomationLane;
