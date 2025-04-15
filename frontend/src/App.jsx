import React, { useState } from 'react';

// components
import ToolbarComponent from './components/Toolbar';
import Canvas from './components/Canvas';
const App = () => {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  return (
    <>
      <div>
        <ToolbarComponent
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          setCanvasHeight={setCanvasHeight}
          setCanvasWidth={setCanvasWidth}
        />
        <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      </div>
    </>
  );
};

export default App;
