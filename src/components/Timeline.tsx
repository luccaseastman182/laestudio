import React, { useRef, useEffect, useState } from 'react';

type TimelineProps = {
  duration: number;
  onCursorMove: (time: number) => void;
  onRegionSelect: (start: number, end: number) => void;
};

const Timeline: React.FC<TimelineProps> = ({ duration, onCursorMove, onRegionSelect }) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      const clickPosition = e.clientX - rect.left;
      const time = (clickPosition / rect.width) * duration;
      setCursorPosition(time);
      onCursorMove(time);
      setIsSelecting(true);
      setSelectionStart(time);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selectionStart !== null) {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (rect) {
        const movePosition = e.clientX - rect.left;
        const time = (movePosition / rect.width) * duration;
        onRegionSelect(selectionStart, time);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsSelecting(false);
      setSelectionStart(null);
    };

    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  return (
    <div
      ref={timelineRef}
      className="timeline"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="cursor" style={{ left: `${(cursorPosition / duration) * 100}%` }}></div>
    </div>
  );
};

export default Timeline;
