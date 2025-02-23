"use client";

import type { BoardWithTodos } from "../types";
import Todo from "./Todo";

interface BoardProps {
  data: BoardWithTodos;
}

export default function Board({ data }: BoardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col overflow-y-auto">
      <div className="h-1/6">
        <h1 className="text-lg font-semibold text-center">{data.title}</h1>
        <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          + 할 일 추가
        </button>
      </div>
      <div className="mt-4 flex-1  space-y-2 p-2">
        {data.todos.length > 0 ? (
          data.todos.map((todo) => <Todo key={todo._id} data={todo} />)
        ) : (
          <div className="text-gray-400 text-center py-6">
            할 일이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
