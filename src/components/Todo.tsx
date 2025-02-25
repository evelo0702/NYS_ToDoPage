import { useState } from "react";
import { Todo as TodoType } from "../types";
import { useBoardStore } from "../store/globalStore";
import { useMotionValue, Reorder } from "framer-motion";

interface TodoProps {
  data: TodoType;
  boardEditMode: boolean;
}

export default function Todo({ data, boardEditMode }: TodoProps) {
  const y = useMotionValue(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(data.boardId); // 선택된 보드 상태
  const [newTodo, setNewTodo] = useState({
    title: data.title,
    content: data.content,
    label: { id: data.label.id, title: data.label.title },
  });

  const { boards, updateTodo, deleteTodo, labelList, moveTodoToBoard } =
    useBoardStore();

  const handleMoveTodo = () => {
    if (selectedBoardId !== data.boardId) {
      moveTodoToBoard(data._id, selectedBoardId);
    }
  };

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

    updateTodo(data.boardId, data._id, changeTodo);
    handleMoveTodo();
    setEditMode(false);
  };

  const handleDeleteTodo = () => {
    const res = confirm("할일을 삭제하시겠습니까?");
    if (res) {
      deleteTodo(data.boardId, data._id);
    }
  };

  const renderTodoContent = () => (
    <div className="flex justify-between">
      {editMode ? (
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) =>
            setNewTodo((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-lg font-semibold mt-1 p-1 border-b "
        />
      ) : (
        <h2 className="text-lg font-semibold mt-1">{data.title}</h2>
      )}

      {!boardEditMode && (
        <div>
          {editMode ? (
            <>
              <button onClick={handleUpdateTodo} className="ms-2">
                완료
              </button>
              <button onClick={() => setEditMode(false)} className="ms-2">
                취소
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="ms-2">
                수정
              </button>
              <button onClick={handleDeleteTodo} className="ms-2">
                삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderLabelAndBoardSelect = () => (
    <div className="mt-2 flex flex-wrap gap-1">
      {editMode ? (
        <>
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
            className="px-2 py-1 border rounded-md"
          >
            <option defaultChecked disabled>
              라벨 변경
            </option>
            {labelList.map((label) => (
              <option key={label._id} value={label._id}>
                {label.title}
              </option>
            ))}
          </select>
          <select
            value={selectedBoardId}
            onChange={(e) => setSelectedBoardId(e.target.value)}
            className="border p-1 rounded"
          >
            <option defaultChecked disabled>
              보드 변경
            </option>
            {boards.map((board) => (
              <option key={board._id} value={board._id}>
                {board.title}
              </option>
            ))}
          </select>
        </>
      ) : (
        <span
          className={`text-xs px-2 py-1 ${
            (data.label.id === "67b9a48f67b4270871740d0b" && "bg-red-200") ||
            (data.label.id === "67b9a48f67b4270871740d0c" && "bg-sky-200") ||
            (data.label.id === "67b9a48f67b4270871740d0d" && "bg-green-200") ||
            (data.label.id === "67b9a48f67b4270871740d0e" && "bg-yellow-200") ||
            (data.label.id === "67b9a48f67b4270871740d0f" && "bg-indigo-200")
          } rounded-md`}
        >
          {data.label.title}
        </span>
      )}
    </div>
  );

  const renderTodoContentText = () => (
    <p className="text-lg  mt-1 line-clamp-2">{data.content}</p>
  );

  const renderTodoTextArea = () => (
    <textarea
      value={newTodo.content}
      onChange={(e) =>
        setNewTodo((prev) => ({ ...prev, content: e.target.value }))
      }
      className="w-full p-2 mt-2 border  rounded-md"
      rows={3}
    />
  );

  return (
    <>
      {boardEditMode ? (
        <Reorder.Item value={data} id={data._id} style={{ y }}>
          <div className="p-3 rounded-lg shadow-sm border-4 border-gray-300 my-2">
            {renderTodoContent()}
            <div className="text-sm  flex justify-between">
              <span>{data.author}</span>
              <span>{new Date(data.date).toLocaleDateString()}</span>
            </div>
            {renderLabelAndBoardSelect()}
            {editMode ? renderTodoTextArea() : renderTodoContentText()}
          </div>
        </Reorder.Item>
      ) : (
        <div className="p-3 rounded-lg shadow-sm border-4 border-gray-300 my-2">
          {renderTodoContent()}
          <div className="text-sm  flex justify-between">
            <span>{data.author}</span>
            <span>{new Date(data.date).toLocaleDateString()}</span>
          </div>
          {renderLabelAndBoardSelect()}
          {editMode ? renderTodoTextArea() : renderTodoContentText()}
        </div>
      )}
    </>
  );
}
