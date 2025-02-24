"use client";

import { useState } from "react";
import { Todo as TodoType } from "../types";
import { useBoardStore } from "../store/globalStore";

interface TodoProps {
  data: TodoType;
}

export default function Todo({ data }: TodoProps) {
  const [editMode, setEditMode] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: data.title,
    content: data.content,
    label: { id: data.label.id, title: data.label.title },
  });
  const { updateTodo, deleteTodo, labelList } = useBoardStore();

  const handleUpdateTodo = () => {
    if (newTodo.title.trim() === "" || newTodo.content.trim() === "") {
      alert("제목과 내용을 입력해주세요");
      return;
    }
    const changeTodo = {
      ...data,
      title: newTodo.title,
      content: newTodo.content,
      label: newTodo.label,
    };
    updateTodo(data.boardId, data._id, changeTodo); // 수정된 내용 업데이트
    setEditMode(false);
  };
  const handleDeleteTodo = () => {
    const res = confirm("할일을 삭제하시겠습니까?");
    if (res) {
      deleteTodo(data.boardId, data._id);
    }
  };

  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
      <div className="flex justify-between">
        {editMode ? (
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) =>
              setNewTodo((prev) => ({ ...prev, title: e.target.value }))
            }
            className="text-lg font-semibold mt-1 p-1 border-b border-gray-400"
          />
        ) : (
          <h2 className="text-lg font-semibold mt-1">{data.title}</h2>
        )}

        <div>
          {editMode ? (
            <>
              <button onClick={handleUpdateTodo} className="text-blue-500 ms-2">
                완료
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="ms-2 text-gray-500"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-500 ms-2"
              >
                수정
              </button>
              <button onClick={handleDeleteTodo} className="ms-2 text-red-500">
                삭제
              </button>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{data.author}</span>
        <span>{new Date(data.date).toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {editMode ? (
          <select
            value={newTodo.label.id}
            onChange={(e) =>
              setNewTodo((prev) => ({
                ...prev,
                label: {
                  id: e.target.value,
                  title: e.target.selectedOptions[0].text,
                },
              }))
            }
            className="text-xs px-2 py-1 border rounded-md"
          >
            <option value="">라벨 선택</option>
            {labelList.map((label) => (
              <option key={label._id} value={label._id}>
                {label.title}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={`text-xs px-2 py-1 ${
              (data.label.id === "67b9a48f67b4270871740d0b" && "bg-red-200") ||
              (data.label.id === "67b9a48f67b4270871740d0c" && "bg-sky-200") ||
              (data.label.id === "67b9a48f67b4270871740d0d" &&
                "bg-green-200") ||
              (data.label.id == "67b9a48f67b4270871740d0e" &&
                "bg-yellow-200") ||
              (data.label.id === "67b9a48f67b4270871740d0f" && "bg-indigo-200")
            } rounded-md`}
          >
            {data.label.title}
          </span>
        )}
      </div>
      {editMode ? (
        <textarea
          value={newTodo.content}
          onChange={(e) =>
            setNewTodo((prev) => ({ ...prev, content: e.target.value }))
          }
          className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          rows={3}
        />
      ) : (
        <p className="text-lg text-gray-600 mt-1 line-clamp-2">
          {data.content}
        </p>
      )}
    </div>
  );
}
