"use client";
import { useState } from "react";
import { Board } from "../types";
import { useMotionValue, Reorder } from "framer-motion";
import updateBoardOrder from "../lib/reorderBoards";
import { useBoardStore } from "../store/globalStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  boards: Board[];
}

export default function Modal({ isOpen, onClose, boards }: ModalProps) {
  const [items, setItems] = useState<Board[]>(boards);
  const handleReorder = (newItems: Board[]) => {
    setItems(newItems);
  };
  const { ChangeOrderBoards } = useBoardStore();

  const handleClose = () => {
    const res = updateBoardOrder(items);
    ChangeOrderBoards(res);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black transition-colors"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          보드 순서 변경
        </h2>

        <Reorder.Group axis="y" onReorder={handleReorder} values={items}>
          {items.map((i) => (
            <Item key={i._id} data={i} />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

function Item({ data }: { data: Board }) {
  const y = useMotionValue(0);

  return (
    <Reorder.Item value={data} id={data._id} style={{ y }}>
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm mb-4 text-gray-700 hover:bg-gray-200 transition-colors">
        <div className="text-lg  text-center">{data.title}</div>
      </div>
    </Reorder.Item>
  );
}
