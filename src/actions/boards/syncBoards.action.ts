"use server";

import { connectDB } from "@/src/lib/mongodb";
import { transformObjectId } from "@/src/lib/changeStringId";
import { Board } from "@/src/types";
import { ObjectId } from "mongodb";

export async function syncBoards(clientBoards: Board[]) {
  try {
    const db = (await connectDB).db(process.env.MONGO_DBNAME);
    const boardsCollection = db.collection("boards");

    // 서버에서 최신 보드 데이터 가져오기
    const serverBoards = await boardsCollection.find().toArray();
    const transformedServerBoards: Board[] = transformObjectId(serverBoards);

    // 추가, 수정, 삭제될 항목들 구분
    const updates: { type: "ADD" | "UPDATE" | "DELETE"; data: Board }[] = [];

    // 1️⃣ 클라이언트에 있는데 서버에 없는 보드 → 추가
    clientBoards.forEach((clientBoard) => {
      if (!transformedServerBoards.some((b) => b._id === clientBoard._id)) {
        updates.push({ type: "ADD", data: clientBoard });
      }
    });

    // 2️⃣ 서버에 있는데 클라이언트에 없는 보드 → 삭제
    transformedServerBoards.forEach((serverBoard) => {
      if (!clientBoards.some((b) => b._id === serverBoard._id)) {
        updates.push({ type: "DELETE", data: serverBoard });
      }
    });

    // 3️⃣ 수정된 보드 찾기 (순서 변경도 포함)
    clientBoards.forEach((clientBoard) => {
      const serverBoard = transformedServerBoards.find(
        (b) => b._id === clientBoard._id
      );

      if (
        serverBoard &&
        (serverBoard.title !== clientBoard.title ||
          serverBoard.order !== clientBoard.order || // ✅ 순서 변경 감지
          JSON.stringify(serverBoard.todos) !==
            JSON.stringify(clientBoard.todos))
      ) {
        updates.push({ type: "UPDATE", data: clientBoard });
      }
    });

    // 변경된 사항이 없다면 종료
    if (updates.length === 0) {
      return {
        success: true,
        message: "변경 사항 없음",
        boards: transformedServerBoards,
      };
    }

    // DB에 변경 사항 반영
    for (const update of updates) {
      if (update.type === "ADD") {
        const { _id, ...newBoard } = update.data; // 🔥 _id 제거
        await boardsCollection.insertOne({
          ...newBoard,
          _id: new ObjectId(_id),
        }); // ✅ ObjectId 변환 후 삽입
      } else if (update.type === "UPDATE") {
        const { _id, ...updateData } = update.data; // 🔥 _id 제외하고 업데이트
        await boardsCollection.updateOne(
          { _id: new ObjectId(_id) }, // ✅ _id 조건만 사용
          { $set: updateData } // ✅ _id 제외한 필드만 업데이트
        );
      } else if (update.type === "DELETE") {
        await boardsCollection.deleteOne({
          _id: new ObjectId(update.data._id),
        }); // ✅ ObjectId 변환 후 삭제
      }
    }

    // 동기화 후 서버의 최신 데이터 다시 가져오기
    const updatedBoards = await boardsCollection.find().toArray();
    const transformedUpdatedBoards = transformObjectId(updatedBoards);

    return {
      success: true,
      message: "동기화 완료",
      boards: transformedUpdatedBoards,
    };
  } catch (error) {
    console.error("syncBoards Error:", error);
    return { success: false, message: "동기화 실패" };
  }
}
