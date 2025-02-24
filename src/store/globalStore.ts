import { create } from "zustand";
import { BoardStore } from "../types";

export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  labelList: [],
  past: [],
  future: [],
  setBoards: (boards) => set({ boards }),
  setLabels: (labels) => set({ labelList: labels }),
  addBoard: (board) => {
    const { boards, past } = get();
    set({
      boards: [...boards, board],
      past: [...past, { type: "ADD_BOARD", payload: board }],
      future: [],
    });
  },
  deleteBoard: (boardId) => {
    const { boards, past } = get();
    const deletedBoard = boards.filter((i) => i._id === boardId);
    const updatedBoards = boards.filter((i) => i._id !== boardId);
    set({
      boards: updatedBoards,
      past: [...past, { type: "DELETE_BOARD", payload: deletedBoard[0] }],
      future: [],
    });
  },
  updateBoard: (id, newTitle) => {
    const { boards, past } = get();
    const boardToUpdate = boards.find((i) => i._id === id);
    if (!boardToUpdate) return;

    const updatedBoard = { ...boardToUpdate, title: newTitle };

    set({
      boards: boards.map((board) => (board._id === id ? updatedBoard : board)), // boards 배열을 불변성 유지하며 갱신
      past: [
        ...past,
        {
          type: "UPDATE_BOARD",
          payload: {
            ...boardToUpdate,
          },
        },
      ],
      future: [],
    });
  },

  undo: () => {
    const { past, future, boards } = get();
    if (past.length === 0) return;

    const lastAction = past[past.length - 1];

    if (lastAction.type === "ADD_BOARD") {
      set({
        boards: boards.filter((board) => board._id !== lastAction.payload._id),
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    } else if (lastAction.type === "DELETE_BOARD") {
      set({
        boards: [...boards, lastAction.payload],
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    } else if (lastAction.type === "UPDATE_BOARD") {
      const { _id, title } = lastAction.payload;
      const changedTitle = boards.filter((i) => i._id === _id);
      lastAction.payload = changedTitle[0];
      const updatedBoards = boards.map((board) =>
        board._id === _id ? { ...board, title: title } : board
      );

      set({
        boards: updatedBoards,
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    }
  },
  redo: () => {
    const { past, future, boards } = get();
    if (future.length === 0) return;
    const nextAction = future[0];
    if (nextAction.type === "ADD_BOARD") {
      set({
        boards: [...boards, nextAction.payload],
        past: [...past, nextAction],
        future: future.slice(1),
      });
    } else if (nextAction.type === "DELETE_BOARD") {
      set({
        boards: boards.filter((i) => i._id !== nextAction.payload._id),
        past: [...past, nextAction],
        future: future.slice(1),
      });
    } else if (nextAction.type === "UPDATE_BOARD") {
      const { _id } = nextAction.payload;
      const undoObject = boards.filter((i) => i._id === _id);
      const changedTitle = boards.filter((i) => i._id !== _id);
      set({
        boards: [...changedTitle, nextAction.payload],
        past: [...past, { ...nextAction, payload: undoObject[0] }],
        future: future.slice(1),
      });
    }
  },
}));
