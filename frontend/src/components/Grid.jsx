import React from 'react';
import { Layer, Line } from 'react-konva';

const Grid = ({ canvasWidth, canvasHeight }) => {
  const GRID_SIZE = 20;
  //   const canvasWidth = stageWidth;
  //   const canvasHeight = stageHeight;

  const gridLines = [];

  for (let i = 0; i < canvasWidth / GRID_SIZE; i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[i * GRID_SIZE, 0, i * GRID_SIZE, canvasHeight]}
        stroke="#e0e0e0"
        strokeWidth={1}
        listening={false} // Disable interaction with vertical lines
      />
    );
  }

  for (let j = 0; j < canvasHeight / GRID_SIZE; j++) {
    gridLines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * GRID_SIZE, canvasWidth, j * GRID_SIZE]}
        stroke="#e0e0e0"
        strokeWidth={1}
        listening={false} // Disable interaction with horizontal lines
      />
    );
  }

  return <Layer>{gridLines}</Layer>;
};

export default Grid;
