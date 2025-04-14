// Canvas.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Stage,
  Layer,
  Line,
  Arrow,
  Circle,
  Rect,
  Transformer,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import useDrawingStore from '../store';

const Canvas = () => {
  const {
    shapes,
    addShape,
    updateShape,
    deleteShape,
    selectedShapeId,
    setSelectedShapeId,
    tool,
    color,
    strokeWidth,
  } = useDrawingStore();

  const stageRef = useRef();
  const transformRef = useRef();
  const [newShape, setNewShape] = useState(null);
  const [freeDrawLine, setFreeDrawLine] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'freedraw') {
      const line = {
        id: uuidv4(),
        type: 'freedraw',
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth,
        lineCap: 'round',
        lineJoin: 'round',
        globalCompositeOperation: 'source-over',
      };
      setFreeDrawLine(line);
      setIsDrawing(true);
      return;
    }

    if (tool == 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedShapeId(null);
      }
      return;
    }

    const shape = {
      id: uuidv4(),
      type: tool,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      points: tool === 'arrow' ? [pos.x, pos.y, pos.x, pos.y] : undefined,
      stroke: color,
      strokeWidth,
      draggable: true,
    };
    setNewShape(shape);
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'freedraw' && isDrawing && freeDrawLine) {
      const updatedLine = {
        ...freeDrawLine,
        points: [...freeDrawLine.points, pos.x, pos.y],
      };
      setFreeDrawLine(updatedLine);
      return;
    }

    if (!newShape) return;

    const updatedShape = { ...newShape };
    if (tool === 'rectangle' || tool === 'circle') {
      updatedShape.width = pos.x - newShape.x;
      updatedShape.height = pos.y - newShape.y;
    } else if (tool === 'arrow') {
      updatedShape.points = [newShape.x, newShape.y, pos.x, pos.y];
    }
    setNewShape(updatedShape);
  };

  const handleMouseUp = () => {
    if (newShape) {
      addShape(newShape);
      setNewShape(null);
    }

    if (freeDrawLine) {
      addShape(freeDrawLine);
      setFreeDrawLine(null);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    const transformer = transformRef.current;
    const stage = stageRef.current;
    const selectedNode = stage.findOne(`#${selectedShapeId}`);

    if (selectedNode && transformer) {
      transformer.nodes([selectedNode]);
      transformer.getLayer().batchDraw();
    } else {
      transformer?.nodes([]);
    }
  }, [selectedShapeId, shapes]);

  const handleTransformEnd = (e, shape) => {
    const node = e.target;
    const newAttrs = {
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
    };
    node.scaleX(1);
    node.scaleY(1);
    updateShape(shape.id, newAttrs);
  };

  const handleSelect = (id) => {
    if (tool === 'select') {
      setSelectedShapeId(id);
    }
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ background: '#f0f0f0' }}
      >
        <Layer>
          {[
            ...shapes,
            ...(newShape ? [newShape] : []),
            ...(freeDrawLine ? [freeDrawLine] : []),
          ].map((shape) => {
            const isSelected = shape.id === selectedShapeId;
            const commonProps = {
              id: shape.id,
              stroke: isSelected ? '#1d4ed8' : shape.stroke,
              shadowColor: isSelected ? '#1d4ed8' : undefined,
              onClick: () => handleSelect(shape.id),
              strokeWidth: shape.strokeWidth,
              draggable: shape.draggable,
              onTransformEnd: (e) => handleTransformEnd(e, shape),
              onDragEnd: (e) =>
                updateShape(shape.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                }),
            };

            switch (shape.type) {
              case 'rectangle':
                return (
                  <Rect
                    {...commonProps}
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                  />
                );
              case 'circle':
                return (
                  <Circle
                    {...commonProps}
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={Math.abs(shape.width / 2)}
                    offsetX={-shape.width / 2}
                    offsetY={-shape.height / 2}
                  />
                );
              case 'arrow':
                return (
                  <Arrow
                    {...commonProps}
                    key={shape.id}
                    points={shape.points}
                    pointerLength={10}
                    pointerWidth={10}
                  />
                );
              case 'freedraw':
                return (
                  <Line
                    {...shape}
                    key={shape.id}
                    tension={0.5}
                    onClick={() => {
                      if (tool === 'eraser') {
                        deleteShape(shape.id); // Only erase if current tool is eraser
                      } else {
                        setSelectedShapeId(shape.id);
                      }
                    }}
                  />
                );
              default:
                return null;
            }
          })}
          <Transformer ref={transformRef} />
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
