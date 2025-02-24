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

      if (
        (matchesBoardTitle && board.todos.length > 0) ||
        filteredTodos.length > 0
      ) {
        return filteredTodos.length > 0
          ? { ...board, todos: filteredTodos }
          : null;
      }

      return null;
    })
    .filter((board) => board !== null)
    .sort((a, b) => a!.order - b!.order)
    .map((board) => ({
      ...board!,
      todos: board!.todos.sort((a, b) => a.order - b.order),
    }));
}
