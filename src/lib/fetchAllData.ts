import { getBoardsAction } from "../actions/boards/getBoards.action";
import { getLabelsAction } from "../actions/labels/getLabels.action";
import { getTodosAction } from "../actions/todos/getTodos.action";

export async function fetchAllData() {
  try {
    const [boards, todos, labels] = await Promise.all([
      getBoardsAction(),
      getTodosAction(),
      getLabelsAction(),
    ]);

    return { boards, todos, labels };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
