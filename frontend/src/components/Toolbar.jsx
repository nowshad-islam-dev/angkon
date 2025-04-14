import React, { useState, useEffect } from 'react';
import useDrawingStore from '../store';

import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
} from '@mui/material';
import {
  Brush,
  RadioButtonUnchecked,
  CropSquare,
  ArrowForward,
  Delete,
  CleaningServices,
  AutoFixOff,
  Undo,
  Redo,
} from '@mui/icons-material';

const ToolbarComponent = () => {
  const {
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    shapes,
    updateShape,
    selectedShapeId,
    deleteShape,
    clearCanvas,
  } = useDrawingStore();

  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  const [localColor, setLocalColor] = useState(color);
  const [localStrokeWidth, setLocalStrokeWidth] = useState(strokeWidth);

  // Update toolbar values when a new shape is selected
  useEffect(() => {
    if (selectedShape) {
      setLocalColor(selectedShape.stroke || '#000000');
      setLocalStrokeWidth(selectedShape.strokeWidth || 2);
    }
  }, [selectedShapeId]);

  // Handle color change
  const handleColorChange = (newColor) => {
    setLocalColor(newColor);
    setColor(newColor); // Always update default color

    if (selectedShapeId) {
      updateShape(selectedShapeId, { stroke: newColor });
    } else {
      setColor(newColor); // For new shapes
    }
  };

  // Handle strokeWidth change
  const handleStrokeWidthChange = (newWidth) => {
    setLocalStrokeWidth(newWidth);
    setStrokeWidth(newWidth); // Always update default strokeWidth

    if (selectedShapeId) {
      updateShape(selectedShapeId, { strokeWidth: newWidth });
    } else {
      setStrokeWidth(newWidth); // For new shapes
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 shadow-sm border-b">
      <div className="w-40">
        <FormControl fullWidth size="small">
          <InputLabel>Tool</InputLabel>
          <Select
            value={tool}
            label="Tool"
            onChange={(e) => setTool(e.target.value)}
          >
            <MenuItem value="select">Select</MenuItem>
            <MenuItem value="freedraw">
              <Brush fontSize="small" className="mr-1" /> Free Draw
            </MenuItem>
            <MenuItem value="circle">
              <RadioButtonUnchecked fontSize="small" className="mr-1" /> Circle
            </MenuItem>
            <MenuItem value="rectangle">
              <CropSquare fontSize="small" className="mr-1" /> Rectangle
            </MenuItem>
            <MenuItem value="arrow">
              <ArrowForward fontSize="small" className="mr-1" /> Arrow
            </MenuItem>
            <MenuItem value="eraser">
              <AutoFixOff fontSize="small" className="mr-1" />
              Eraser
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Color</label>
        <input
          type="color"
          value={localColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-10 h-10 border rounded-md cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 w-40">
        <label className="text-sm whitespace-nowrap">Stroke Width</label>
        <Slider
          min={1}
          max={10}
          value={localStrokeWidth}
          onChange={(e, val) => handleStrokeWidthChange(val)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => {
            if (selectedShapeId) deleteShape(selectedShapeId);
          }}
        >
          <Delete fontSize="small" className="mr-1" />
          Delete Selected
        </button>

        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          onClick={clearCanvas}
        >
          <CleaningServices fontSize="small" className="mr-1" />
          Clear Canvas
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">
          <Undo fontSize="small" className="mr-1" />
          Undo
        </button>

        <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">
          <Redo fontSize="small" className="mr-1" />
          Redo
        </button>
      </div>
    </div>
  );
};

export default ToolbarComponent;
