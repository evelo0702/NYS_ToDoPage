"use client";

import { Todo as TodoType } from "../types";

interface TodoProps {
  data: TodoType;
}

export default function Todo({ data }: TodoProps) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mt-1">{data.title}</h2>
        <div>
          <button>수정</button>
          <button className="ms-2">삭제</button>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{data.author}</span>
        <span>{new Date(data.date).toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <span
          className={`text-xs px-2 py-1 ${
            (data.label.id === "67b9a48f67b4270871740d0b" && "bg-red-200") ||
            (data.label.id === "67b9a48f67b4270871740d0c" && "bg-sky-200") ||
            (data.label.id === "67b9a48f67b4270871740d0d" && "bg-green-200") ||
            (data.label.id == "67b9a48f67b4270871740d0e" && "bg-yellow-200") ||
            (data.label.id === "67b9a48f67b4270871740d0f" && "bg-indigo-200")
          } rounded-md`}
        >
          {data.label.title}
        </span>
      </div>
      <p className="text-lg text-gray-600 mt-1 line-clamp-2">{data.content}</p>
    </div>
  );
}
