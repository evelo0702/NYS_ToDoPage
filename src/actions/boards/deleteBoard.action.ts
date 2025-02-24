"use server";

import { connectDB } from "@/src/lib/mongodb";
import { ApiResponse } from "@/src/types";
import { ObjectId } from "mongodb";

export async function deleteBoardAction(boardId: string): Promise<ApiResponse> {
  try {
    const db = (await connectDB).db(process.env.MONGO_DBNAME);
    const boardsCollection = db.collection("boards");

    const objectId = new ObjectId(boardId);
    const result = await boardsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return { success: false, message: "보드 삭제 실패", status: 404 };
    }

    return { success: true, message: "보드 삭제 성공", status: 200 };
  } catch (error) {
    console.error("deleteBoard Error:", error);
    return { success: false, message: "서버 오류 발생", status: 500 };
  }
}
