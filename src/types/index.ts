// 보드 타입
export interface Board {
  _id: string;
  title: string;
  order: number;
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
export interface BoardWithTodos extends Board {
  todos: Todo[];
}

// 스토어 타입
export interface BoardStore {
  boards: BoardWithTodos[];
  labelList: Label[];
  setBoards: (boards: BoardWithTodos[]) => void;
  addBoard: (board: BoardWithTodos) => void;
  updateBoard: (updatedBoard: BoardWithTodos) => void;
  deleteBoard: (boardId: string) => void;
  setLabels: (labels: Label[]) => void;
}
