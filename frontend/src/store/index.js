import { create } from 'zustand';

const useDrawingStore = create((set) => ({
  shapes: [],
  selectedShapeId: null,
  tool: 'select',
  color: '#000000',
  strokeWidth: 2,
  isDrawing: false,

  setColor: (color) => set({ color }),
  setTool: (tool) => set({ tool }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  addShape: (shape) =>
    set((state) => ({
      shapes: [...state.shapes, shape],
    })),

  updateShape: (id, newAttrs) => {
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...newAttrs } : s
      ),
    }));
  },

  setSelectedShapeId: (id) => set({ selectedShapeId: id }),

  deleteShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
      selectedShapeId:
        state.selectedShapeId === id ? null : state.selectedShapeId,
    }));
  },

  clearCanvas: () => set({ shapes: [], selectedShapeId: null }),
}));

export default useDrawingStore;
