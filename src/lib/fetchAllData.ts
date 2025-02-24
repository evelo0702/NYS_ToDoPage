import { getBoardsAction } from "../actions/boards/getBoards.action";
import { getLabelsAction } from "../actions/labels/getLabels.action";

export async function fetchAllData() {
  try {
    const [boards, labels] = await Promise.all([
      getBoardsAction(),
      getLabelsAction(),
    ]);

    return { boards, labels };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
