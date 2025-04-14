import React from 'react';

// components
import ToolbarComponent from './components/Toolbar';
import Canvas from './components/Canvas';
const App = () => {
  return (
    <>
      <div>
        <ToolbarComponent />
        <Canvas />
      </div>
    </>
  );
};

export default App;
