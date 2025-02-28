"use client";

import { useEffect, useState } from "react";
import Todo from "./Todo";
import { useBoardStore } from "../store/globalStore";
import TodoAddModal from "./TodoAddModal";
import { Board as BoardType, Todo as TodoType } from "../types";
import { Reorder } from "framer-motion";
interface BoardProps {
  data: BoardType;
}

export default function BoardComponent({ data }: BoardProps) {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(data.title);
  const { ChangeOrderTodo, deleteBoard, updateBoard, labelList } =
    useBoardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(data.todos);
  const handleUpdateBoard = () => {
    if (newTitle.trim() === "") {
      alert("보드명을 입력해주세요");
      return;
    }
    ChangeOrderTodo(data._id, items);
    updateBoard(data._id!, newTitle);
    setEditMode(false);
  };
  const handleDeleteBoard = () => {
    const res = confirm("보드를 삭제하시겠습니까?");
    if (res) {
      deleteBoard(data._id);
    }
  };
  useEffect(() => {
    setItems(data.todos);
  }, [data]);

  const handleReorder = (newItems: TodoType[]) => {
    setItems(newItems);
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col  border-l-4 border-indigo-300 ">
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
                className="text-blue-500  text-lg font-extrabold"
                onClick={handleUpdateBoard}
              >
                완료
              </button>
            ) : (
              <button
                className="text-lg font-extrabold"
                onClick={() => setEditMode(true)}
              >
                수정
              </button>
            )}
            <button
              className="col-span-1 text-red-700 text-lg font-extrabold ms-2"
              onClick={handleDeleteBoard}
            >
              삭제
            </button>
          </div>
        </div>
        <button
          className="mt-2 w-full bg-gray-100 border border-gray-300 text-gray-800 font-bold  rounded-md py-2"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          + 할 일 추가
        </button>
      </div>
      <div className="mt-4 flex-col space-y-2 p-2 h-full overflow-y-auto  scrollbar-hide">
        {editMode && items.length > 0 ? (
          <Reorder.Group axis="y" onReorder={handleReorder} values={items}>
            {items.map((i) => (
              <Todo
                key={`${i._id}+${i.title}+${i.content}+${i.boardId}+${i.order}`}
                data={i}
                boardEditMode={editMode}
              />
            ))}
          </Reorder.Group>
        ) : !editMode && data.todos.length > 0 ? (
          <div>
            {data.todos.map((i) => (
              <Todo
                key={`${i._id}+${i.title}+${i.content}+${i.boardId}+${i.order}`}
                data={i}
                boardEditMode={editMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-6">
            새로운 할 일을 추가해주세요
          </div>
        )}
      </div>
      <TodoAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        labels={labelList}
        boardId={data._id!}
        length={data.todos.length}
      />
    </div>
  );
}
