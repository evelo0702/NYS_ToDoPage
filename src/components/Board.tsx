"use client";

import { useState } from "react";
import type { BoardWithTodos } from "../types";
import Todo from "./Todo";
import { useBoardStore } from "../store/globalStore";

interface BoardProps {
  data: BoardWithTodos;
}

export default function Board({ data }: BoardProps) {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(data.title);
  const { deleteBoard, updateBoard } = useBoardStore();
  // const handleDeleteBoard = async (boardId: string) => {
  //   const cf = confirm("보드를 삭제하시겠습니까?");
  //   if (cf) {
  //     const response = await deleteBoard(boardId);

  //     if (response.success) {
  //       alert(response.message);
  //     } else {
  //       alert(`${response.message} (상태 코드: ${response.status})`);
  //     }
  //   }
  // };
  const handleUpdateBoard = async () => {
    if (newTitle.trim() === "") {
      alert("보드명을 입력해주세요");
      return;
    }
    if (data.title.trim() == newTitle.trim()) {
      alert("기존 보드명과 동일합니다");
      setEditMode(false);
      return;
    }
    updateBoard(data._id, newTitle);
    setEditMode(false);
  };

  // const response = await updateBoard(data._id, newTitle);
  // if (response.success) {
  //   alert(response.message);
  //   setEditMode(false);
  // } else {
  //   alert(`${response.message} 상태 코드: ${response.status}`);
  // }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <div className="">
        <div className="flex justify-between">
          <div className="">
            {editMode ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-9 text-xl font-semibold  border p-1 ms-3"
              />
            ) : (
              <h1 className="col-span-9 text-xl font-semibold text-center ms-3">
                {newTitle}
              </h1>
            )}
          </div>

          {/* 수정/완료 버튼 */}
          <div className="w-1/5 flex">
            {editMode ? (
              <button
                className="text-blue-500 font-bold"
                onClick={handleUpdateBoard}
              >
                완료
              </button>
            ) : (
              <button
                className="text-gray-500 font-bold"
                onClick={() => setEditMode(true)}
              >
                수정
              </button>
            )}
            <button
              className="col-span-1 text-red-700 font-bold ms-2"
              // onClick={() => handleDeleteBoard(data._id)}
              onClick={() => deleteBoard(data._id)}
            >
              삭제
            </button>
          </div>
        </div>
        <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          + 할 일 추가
        </button>
      </div>
      <div className="mt-4 flex-col space-y-2 p-2 h-full overflow-y-auto">
        {data.todos.length > 0 ? (
          data.todos.map((todo) => <Todo key={todo._id} data={todo} />)
        ) : (
          <div className="text-gray-400 text-center py-6">
            새로운 할 일을 추가해주세요
          </div>
        )}
      </div>
    </div>
  );
}
