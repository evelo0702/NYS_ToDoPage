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
      boards: [...boards, board].map((board) => ({
        ...board,
        todos: board.todos.sort((a, b) => a.order - b.order),
      })),

      past: [...past, { type: "ADD_BOARD", payload: board }],
      future: [],
    });
  },
  deleteBoard: (boardId) => {
    const { boards, past } = get();
    const deletedBoard = boards.filter((i) => i._id === boardId);
    const updatedBoards = boards.filter((i) => i._id !== boardId);

    set({
      boards: updatedBoards.map((board) => ({
        ...board,
        todos: board.todos.sort((a, b) => a.order - b.order),
      })),

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
      boards: boards
        .map((board) => (board._id === id ? updatedBoard : board))
        .map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })), // boards 배열을 불변성 유지하며 갱신
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
  addTodo: (newTodo) => {
    const { boards, past } = get();
    const boardToUpdate = boards.find((i) => i._id === newTodo.boardId);
    if (!boardToUpdate) return;

    const updatedBoard = {
      ...boardToUpdate,
      todos: [...boardToUpdate.todos, newTodo],
    };
    set({
      boards: boards
        .map((i) => (i._id === newTodo.boardId ? updatedBoard : i))
        .map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
      past: [...past, { type: "ADD_TODO", payload: newTodo }],
      future: [],
    });
  },
  updateTodo: (boardId, todoId, updatedTodo) => {
    const { boards, past } = get();
    const boardToUpdate = boards.find((i) => i._id === boardId);
    if (!boardToUpdate) return;
    const originalTodo = boardToUpdate.todos.filter((i) => i._id === todoId);
    const updatedTodos = boardToUpdate.todos.map((todo) =>
      todo._id === todoId ? { ...todo, ...updatedTodo } : todo
    );
    console.log(updatedTodos);

    set({
      boards: boards
        .map((board) =>
          board._id === boardId ? { ...board, todos: updatedTodos } : board
        )
        .map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
      past: [...past, { type: "UPDATE_TODO", payload: originalTodo[0] }],
      future: [],
    });
  },
  deleteTodo: (boardId, todoId) => {
    const { boards, past } = get();
    const boardToUpdate = boards.find((i) => i._id === boardId);
    if (!boardToUpdate) return;
    const changeTodo = boardToUpdate.todos.filter((i) => i._id === todoId);
    const updatedTodos = boardToUpdate.todos.filter((i) => i._id !== todoId);

    set({
      boards: boards
        .map((board) =>
          board._id === boardId ? { ...board, todos: updatedTodos } : board
        )
        .map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
      past: [...past, { type: "DELETE_TODO", payload: { changeTodo } }],
      future: [],
    });
  },
  undo: () => {
    const { past, future, boards } = get();
    if (past.length === 0) return;

    const lastAction = past[past.length - 1];

    if (lastAction.type === "ADD_BOARD") {
      set({
        boards: boards
          .filter((board) => board._id !== lastAction.payload._id)
          .map((board) => ({
            ...board,
            todos: board.todos.sort((a, b) => a.order - b.order),
          })),
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
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    } else if (lastAction.type === "ADD_TODO") {
      const { boardId, _id } = lastAction.payload;
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? { ...board, todos: board.todos.filter((todo) => todo._id !== _id) }
          : board
      );

      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    } else if (lastAction.type === "UPDATE_TODO") {
      const { boardId, _id } = lastAction.payload;
      console.log(lastAction.payload);
      const changeTodo = boards
        .filter((i) => i._id === boardId)[0]
        .todos.filter((j) => j._id === _id);
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? {
              ...board,
              todos: board.todos.map((todo) =>
                todo._id === _id ? { ...lastAction.payload } : todo
              ),
            }
          : board
      );
      console.log(updatedBoards);
      console.log(changeTodo);
      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: past.slice(0, -1),
        future: [{ ...lastAction, payload: changeTodo[0] }, ...future],
      });
    } else if (lastAction.type === "DELETE_TODO") {
      const { boardId } = lastAction.payload.changeTodo[0];
      console.log(lastAction.payload.changeTodo);
      console.log(boardId);
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? {
              ...board,
              todos: [...board.todos, lastAction.payload.changeTodo[0]],
            }
          : board
      );
      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
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
        boards: boards
          .filter((i) => i._id !== nextAction.payload._id)
          .map((board) => ({
            ...board,
            todos: board.todos.sort((a, b) => a.order - b.order),
          })),
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
    } else if (nextAction.type === "ADD_TODO") {
      const { boardId } = nextAction.payload;
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? { ...board, todos: [...board.todos, nextAction.payload] }
          : board
      );

      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: [...past, nextAction],
        future: future.slice(1),
      });
    } else if (nextAction.type === "UPDATE_TODO") {
      console.log(nextAction.payload);
      const { boardId, _id } = nextAction.payload;
      const originalTodo = boards
        .filter((board) => board._id === boardId)[0]
        .todos.filter((i) => i._id === _id);
      console.log(originalTodo);
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? {
              ...board,
              todos: board.todos.map((todo) =>
                todo._id === _id ? { ...nextAction.payload } : todo
              ),
            }
          : board
      );
      console.log(updatedBoards);
      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: [...past, { ...nextAction, payload: originalTodo[0] }],
        future: future.slice(1),
      });
    } else if (nextAction.type === "DELETE_TODO") {
      const { boardId, _id } = nextAction.payload.changeTodo[0];
      console.log(nextAction.payload.changeTodo);
      console.log(boardId);
      console.log(_id);
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? { ...board, todos: board.todos.filter((i) => i._id !== _id) }
          : board
      );
      set({
        boards: updatedBoards.map((board) => ({
          ...board,
          todos: board.todos.sort((a, b) => a.order - b.order),
        })),
        past: [...past, nextAction],
        future: future.slice(1),
      });
    }
  },
}));
