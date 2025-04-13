import { create } from 'zustand';

const useDrawingStore = create((set) => ({
  lines: [],
  color: '#000000',
  strokeWidth: 5,
  isDrawing: false,

  setColor: (color) => set({ color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  startDrawing: () => set({ isDrawing: true }),
  stopDrawing: () => set({ isDrawing: false }),

  addLine: (newLine) => set((state) => ({ lines: [...state.lines, newLine] })),

  updateLastLine: (newPoints) =>
    set((state) => {
      const lines = [...state.lines];
      if (lines.length === 0) return {};
      lines[lines.length - 1] = {
        ...lines[lines.length - 1],
        points: newPoints,
      };
      return { lines };
    }),
}));

export default useDrawingStore;
