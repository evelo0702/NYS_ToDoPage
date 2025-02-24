"use server";

import { connectDB } from "@/src/lib/mongodb";
import { ApiResponse } from "@/src/types";


export async function addBoardAction(title: string): Promise<ApiResponse> {
  try {
    const db = (await connectDB).db(process.env.MONGO_DBNAME);
    const boardsCollection = db.collection("boards");

    const boardCount = await boardsCollection.countDocuments();
    const newBoard = {
      title,
      order: boardCount,
    };

    const result = await boardsCollection.insertOne(newBoard);

    if (!result.acknowledged) {
      return { success: false, message: "보드 추가 실패", status: 500 };
    }

    return { success: true, message: "보드 추가 성공", status: 201 };
  } catch (error) {
    console.error("addBoard Error:", error);
    return { success: false, message: "서버 오류 발생", status: 500 };
  }
}
