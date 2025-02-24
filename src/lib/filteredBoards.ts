// utils/filterBoards.ts
import { BoardWithTodos, Label } from "../types";

export function filterBoards(
  boards: BoardWithTodos[],
  searchLabel: Label | null,
  searchQuery: string,
  searchDate: string | null
): BoardWithTodos[] {
  return boards
    .map((board) => {
      // 보드 제목에 검색어가 포함되는지 확인
      const matchesBoardTitle = searchQuery
        ? board.title.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, ""))
        : true;

      if (matchesBoardTitle) {
        const filteredTodos = board.todos.filter((todo) => {
          const matchesLabel = searchLabel ? todo.label.id === searchLabel._id : true;
          const matchesDate = searchDate ? todo.date === searchDate : true;
          return matchesLabel && matchesDate;
        });

        return { ...board, todos: filteredTodos };
      } else {
        const filteredTodos = board.todos.filter((todo) => {
          const matchesLabel = searchLabel ? todo.label.id === searchLabel._id : true;
          const matchesQuery = searchQuery
            ? todo.title.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, "")) ||
              todo.content.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, ""))
            : true;
          const matchesDate = searchDate ? todo.date === searchDate : true;
          return matchesLabel && matchesQuery && matchesDate;
        });

        return { ...board, todos: filteredTodos };
      }
    })
    .filter((board) => board !== null)
    .sort((a, b) => a.order - b.order);
}
