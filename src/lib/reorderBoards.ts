import { Board } from "../types";

export default function updateBoardOrder(boards: Board[]) {
  return boards.map((board, index) => ({
    ...board,
    order: index,
    todos: board.todos.map((todo, todoIndex) => ({
      ...todo,
      order: todoIndex,
    })),
  }));
}
