// src/app/actions/boards/updateBoard.action.ts
"use server";

import { connectDB } from "@/src/lib/mongodb";
import { ApiResponse } from "@/src/types";
import { ObjectId } from "mongodb";

export async function updateBoardAction(
  boardId: string,
  newTitle: string
): Promise<ApiResponse> {
  try {
    if (!boardId || !newTitle.trim()) {
      return {
        status: 400,
        success: false,
        message: "보드 ID와 새로운 제목을 확인해주세요",
      };
    }

    const db = (await connectDB).db(process.env.MONGO_DBNAME);
    const boardsCollection = db.collection("boards");

    const objectId = new ObjectId(boardId);
    const result = await boardsCollection.updateOne(
      { _id: objectId },
      { $set: { title: newTitle } }
    );

    if (result.matchedCount === 0) {
      return {
        status: 404,
        success: false,
        message: "해당 보드를 찾을 수 없습니다",
      };
    }

    return {
      status: 200,
      success: true,
      message: "보드명이 업데이트되었습니다.",
    };
  } catch (error) {
    console.error("보드 업데이트 실패:", error);

    return {
      status: 500,
      success: false,
      message: "보드 업데이트에 실패했습니다.",
    };
  }
}
