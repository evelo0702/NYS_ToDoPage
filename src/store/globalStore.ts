import { create } from "zustand";
import { BoardStore } from "../types";
import { syncBoards } from "../actions/boards/syncBoards.action";
import { getBoardsAction } from "../actions/boards/getBoards.action";

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
    if (boardToUpdate.title === newTitle) return;
    const updatedBoard = { ...boardToUpdate, title: newTitle };

    set({
      boards: boards.map((board) => (board._id === id ? updatedBoard : board)),
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
      boards: boards.map((i) => (i._id === newTodo.boardId ? updatedBoard : i)),
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
    if (
      originalTodo[0].title === updatedTodo.title &&
      originalTodo[0].content === updatedTodo.content &&
      originalTodo[0].label === originalTodo[0].label
    )
      return;

    set({
      boards: boards.map((board) =>
        board._id === boardId ? { ...board, todos: updatedTodos } : board
      ),
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
      boards: boards.map((board) =>
        board._id === boardId ? { ...board, todos: updatedTodos } : board
      ),
      past: [...past, { type: "DELETE_TODO", payload: { changeTodo } }],
      future: [],
    });
  },
  syncBoardsWithServer: async () => {
    const { boards } = get();
    const response = await syncBoards(boards);
    const res = await getBoardsAction();
    console.log(res);

    if (response.success && response.boards) {
      set({ boards: response.boards });
    }
  },
  ChangeOrderTodo: (boardId, todos) => {
    const { boards } = get();

    const boardIndex = boards.findIndex((b) => b._id === boardId);
    if (boardIndex === -1) return;

    const updatedTodos = todos.map((todo, index) => ({
      ...todo,
      order: index,
    }));
    const updateBoard = boards.map((i) =>
      i._id === boardId ? { ...i, todos: updatedTodos } : i
    );

    set({
      boards: updateBoard,
    });
  },
  ChangeOrderBoards: (changeBoards) => {
    set({ boards: changeBoards });
  },

  moveTodoToBoard: (todoId, newBoardId) => {
    const { boards } = get();

    // 현재 todo가 속한 보드 찾기
    const prevBoard = boards.find((board) =>
      board.todos.some((todo) => todo._id === todoId)
    );

    if (!prevBoard) return;

    // 이동할 todo 찾기
    const todo = prevBoard.todos.find((todo) => todo._id === todoId);
    if (!todo) return;

    // 이전 보드에서 todo 제거
    prevBoard.todos = prevBoard.todos.filter((todo) => todo._id !== todoId);
    // 새 보드에 todo 추가 (boardId 변경)
    const newBoard = boards.find((board) => board._id === newBoardId);
    if (newBoard) {
      newBoard.todos.push({ ...todo, boardId: newBoardId });
    }

    // 상태 업데이트
    set({ boards: [...boards] });
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
    } else if (lastAction.type === "ADD_TODO") {
      const { boardId, _id } = lastAction.payload;
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? { ...board, todos: board.todos.filter((todo) => todo._id !== _id) }
          : board
      );

      set({
        boards: updatedBoards,
        past: past.slice(0, -1),
        future: [lastAction, ...future],
      });
    } else if (lastAction.type === "UPDATE_TODO") {
      const { boardId, _id } = lastAction.payload;
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

      set({
        boards: updatedBoards,
        past: past.slice(0, -1),
        future: [{ ...lastAction, payload: changeTodo[0] }, ...future],
      });
    } else if (lastAction.type === "DELETE_TODO") {
      const { boardId } = lastAction.payload.changeTodo[0];

      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? {
              ...board,
              todos: [...board.todos, lastAction.payload.changeTodo[0]],
            }
          : board
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
      const { boardId, _id } = nextAction.payload;
      const originalTodo = boards
        .filter((board) => board._id === boardId)[0]
        .todos.filter((i) => i._id === _id);
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
      set({
        boards: updatedBoards,
        past: [...past, { ...nextAction, payload: originalTodo[0] }],
        future: future.slice(1),
      });
    } else if (nextAction.type === "DELETE_TODO") {
      const { boardId, _id } = nextAction.payload.changeTodo[0];
      const updatedBoards = boards.map((board) =>
        board._id === boardId
          ? { ...board, todos: board.todos.filter((i) => i._id !== _id) }
          : board
      );
      set({
        boards: updatedBoards,
        past: [...past, nextAction],
        future: future.slice(1),
      });
    }
  },
}));
