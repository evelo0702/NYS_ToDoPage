"use server";

import { transformObjectId } from "@/src/lib/changeStringId";
import { connectDB } from "@/src/lib/mongodb";

export async function getBoardsAction() {
  try {
    const db = (await connectDB).db(process.env.MONGO_DBNAME);
    const boardsCollection = db.collection("boards");
    const boards = await boardsCollection.find().toArray();
    return {
      success: true,
      message: "보드 목록 불러오기 성공",
      status: 200,
      data: transformObjectId(boards),
    };
  } catch (error) {
    console.error("getBoards Error:", error);
    return {
      success: false,
      message: "보드 목록을 불러오는 중 오류 발생",
      status: 500,
    };
  }
}
