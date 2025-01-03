import React from 'react';

type MeterBridgesProps = {
  levels: number[];
};

const MeterBridges: React.FC<MeterBridgesProps> = ({ levels }) => {
  return (
    <div className="meter-bridges">
      {levels.map((level, index) => (
        <div key={index} className="meter-bridge">
          <div
            className="meter-level"
            style={{ height: `${level}%` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default MeterBridges;
