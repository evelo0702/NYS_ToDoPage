// 보드 타입
export interface Board {
  _id: string;
  title: string;
  order: number;
  todos: Todo[];
}
// 카드 타입
export interface Todo {
  _id: string;
  boardId: string;
  author: string;
  title: string;
  content: string;
  label: { id: string; title: string };
  order: number;
  date: string;
}
// 라벨 타입
export interface Label {
  _id: string;
  title: string;
}

// 보드 + 카드

interface Action {
  type: string;
  payload: any;
}
// 스토어 타입
export interface BoardStore {
  boards: Board[];
  labelList: Label[];
  past: Action[];
  future: Action[];
  setBoards: (boards: Board[]) => void;
  setLabels: (labels: Label[]) => void;
  addBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  updateBoard: (boardId: string, newTitle: string) => void;
  undo: () => void;
  redo: () => void;
  addTodo: (newTodo: Todo) => void;
  updateTodo: (boardId: string, todoId: string, updatedTodo: Todo) => void;
  deleteTodo: (boardId: string, todoId: string) => void;
  ChangeOrderTodo: (boardId: string, todos: Todo[]) => void;
  ChangeOrderBoards: (changeBoards: Board[]) => void;
  syncBoardsWithServer: () => void;
  moveTodoToBoard: (todoId: string, newBoardId: string) => void;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
}

export interface Task {
  id: number;
  label: string;
  completed: boolean;
}
