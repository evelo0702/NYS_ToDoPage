import React, { useState } from "react";
import { Label } from "../types";
import { getDate } from "../lib/getDate";
import { useBoardStore } from "../store/globalStore";
import { v4 as uuidv4 } from "uuid";

interface TodoAddModalProps {
  isOpen: boolean;
  boardId: string;
  onClose: () => void;
  labels: Label[];
  length: number;
}

const TodoAddModal: React.FC<TodoAddModalProps> = ({
  isOpen,
  onClose,
  labels,
  boardId,
  length,
}) => {
  const [todoForm, setTodoForm] = useState({
    _id: "",
    author: "",
    title: "",
    content: "",
    label: { id: "", title: "" }, // label 객체로 변경
  });
  const { addTodo } = useBoardStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // label 변경 시
    if (name === "label") {
      const selectedLabel = labels.find((label) => label._id === value);
      setTodoForm((prevForm) => ({
        ...prevForm,
        label: selectedLabel
          ? { id: selectedLabel._id, title: selectedLabel.title }
          : { id: "", title: "" },
      }));
    } else {
      setTodoForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const { author, title, content, label } = todoForm;

    if (!author || !title || !content || !label.id) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    const newTodo = {
      _id: uuidv4(),
      author,
      title,
      content,
      label, // label 객체 사용
      boardId,
      date: getDate(),
      order: length,
    };
    addTodo(newTodo);
    setTodoForm({
      _id: "",
      author: "",
      title: "",
      content: "",
      label: { id: "", title: "" }, // 초기화 시 label 객체로 초기화
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()} // 모달 외부 클릭 시 닫히지 않도록
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">할 일 추가</h2>
          <button
            className="text-2xl text-red-600 me-4 font-extrabold"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-gray-700">
            작성자
          </label>
          <input
            id="author"
            name="author"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={todoForm.author}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={todoForm.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            value={todoForm.content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="label" className="block text-gray-700">
            라벨
          </label>
          <select
            id="label"
            name="label"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={todoForm.label.id}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            {labels.map((label) => (
              <option key={label._id} value={label._id}>
                {label.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoAddModal;
