import BoardList from "../components/BoardList";
import { fetchAllData } from "../lib/fetchAllData";
import { Board, BoardWithTodos, Todo } from "../types";

export default async function Home() {
  const { boards, todos, users, labels } = await fetchAllData();

  // 정규화된 구조의 보드와 카드 데이터를 합치는 작업
  const boardsWithTodos: BoardWithTodos[] = boards.map((board: Board) => ({
    ...board,
    todos: todos
      .filter((todo: Todo) => todo.boardId === board._id)
      .sort((a: Todo, b: Todo) => a.order - b.order),
  }));
  return (
    <div className="">
      <BoardList boardsWithTodos={boardsWithTodos} />
    </div>
  );
}
