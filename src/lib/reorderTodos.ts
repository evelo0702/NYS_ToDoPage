import { Board } from "../types";

export function reorderTodos(board: Board) {
  return {
    ...board,
    todos: board.todos
      .sort((a, b) => a.order - b.order)
      .map((todo, index) => ({ ...todo, order: index })),
  };
}
