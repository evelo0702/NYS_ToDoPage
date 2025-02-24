import BoardList from "../components/BoardList";
import { fetchAllData } from "../lib/fetchAllData";

export default async function Home() {
  const { boards, labels } = await fetchAllData();

  return (
    <div>
      <BoardList BoardsData={boards.data} labels={labels} />
    </div>
  );
}
