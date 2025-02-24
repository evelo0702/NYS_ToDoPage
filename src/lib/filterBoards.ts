import { Board, Label } from "../types";

export function filterBoards(
  boards: Board[],
  searchLabel: Label | null,
  searchQuery: string,
  searchDate: string | null
): Board[] {
  return boards
    .map((board) => {
      const matchesBoardTitle =
        searchQuery.length > 0
          ? board.title
              .replace(/\s/g, "")
              .includes(searchQuery.replace(/\s/g, ""))
          : true;

      const filteredTodos = board.todos.filter((todo) => {
        const matchesLabel = searchLabel
          ? todo.label.id === searchLabel._id
          : true;
        const matchesQuery =
          searchQuery.length > 0
            ? todo.title
                .replace(/\s/g, "")
                .includes(searchQuery.replace(/\s/g, "")) ||
              todo.content
                .replace(/\s/g, "")
                .includes(searchQuery.replace(/\s/g, ""))
            : true;
        const matchesDate = searchDate ? todo.date === searchDate : true;

        return matchesLabel && matchesQuery && matchesDate;
      });

      // 보드 제목이 검색어와 일치하거나, 필터링된 todo가 하나라도 있으면 유지
      if (matchesBoardTitle || filteredTodos.length > 0) {
        return { ...board, todos: filteredTodos };
      }

      return null; // 검색 결과가 없으면 제거
    })
    .filter((board) => board !== null) // `null` 제거
    .sort((a, b) => a.order - b.order) as Board[];
}
