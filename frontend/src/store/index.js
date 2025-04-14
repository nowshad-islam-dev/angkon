import { create } from 'zustand';

const useDrawingStore = create((set) => ({
  shapes: [],
  undoStack: [],
  redoStack: [],
  selectedShapeId: null,
  tool: 'select',
  color: '#000000',
  strokeWidth: 2,
  isDrawing: false,

  setColor: (color) => set({ color }),
  setTool: (tool) => set({ tool }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  pushToUndo: () =>
    set((state) => ({
      undoStack: [...state.undoStack, state.shapes],
      redoStack: [], // clear redo stack on new action
    })),

  addShape: (shape) =>
    set((state) => {
      const newShape = {
        ...shape,
        color: state.color,
        strokeWidth: state.strokeWidth,
      };
      return {
        undoStack: [...state.undoStack, state.shapes],
        shapes: [...state.shapes, newShape],
        redoStack: [],
      };
    }),

  updateShape: (id, newAttrs) => {
    set((state) => ({
      undoStack: [...state.undoStack, state.shapes],
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...newAttrs } : s
      ),
      redoStack: [],
    }));
  },

  setSelectedShapeId: (id) => set({ selectedShapeId: id }),

  deleteShape: (id) =>
    set((state) => ({
      undoStack: [...state.undoStack, state.shapes],
      shapes: state.shapes.filter((s) => s.id !== id),
      redoStack: [],
    })),

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return {};
      const prevShapes = state.undoStack[state.undoStack.length - 1];
      const newUndo = state.undoStack.slice(0, -1);
      return {
        shapes: prevShapes,
        undoStack: newUndo,
        redoStack: [...state.redoStack, state.shapes],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return {};
      const nextShapes = state.redoStack[state.redoStack.length - 1];
      const newRedo = state.redoStack.slice(0, -1);
      return {
        shapes: nextShapes,
        redoStack: newRedo,
        undoStack: [...state.undoStack, state.shapes],
      };
    }),

  clearCanvas: () =>
    set((state) => ({
      undoStack: [...state.undoStack, state.shapes],
      shapes: [],
      redoStack: [],
    })),
}));

export default useDrawingStore;
