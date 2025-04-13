// FreeDrawingCanvas.jsx
import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import useDrawingStore from '../store';

const Canvas = () => {
  const stageRef = useRef();
  const {
    lines,
    color,
    strokeWidth,
    isDrawing,
    startDrawing,
    stopDrawing,
    addLine,
    updateLastLine,
  } = useDrawingStore();

  const handleMouseDown = (e) => {
    startDrawing();
    const pos = e.target.getStage().getPointerPosition();
    addLine({
      tool: 'pen',
      points: [pos.x, pos.y],
      stroke: color,
      strokeWidth,
      tension: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    const newPoints = [...lastLine.points, point.x, point.y];
    updateLastLine(newPoints);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        style={{ background: '#fff' }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line key={i} {...line} />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
