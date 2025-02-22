// store.ts
import { create } from "zustand";
import { BoardStore } from "../types";

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  labelList: [],
  setBoards: (boards) => set({ boards }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  updateBoard: (updatedBoard) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board._id === updatedBoard._id ? updatedBoard : board
      ),
    })),
  deleteBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board._id !== boardId),
    })),
  setLabels: (labels) => set({ labelList: labels }),
}));
