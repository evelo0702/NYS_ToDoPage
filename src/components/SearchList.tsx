"use client";

import { useState } from "react";
import { Label } from "../types";
import { useBoardStore } from "../store/globalStore";

interface SearchListProps {
  setSearchLabel: (label: Label | null) => void;
  setSearchDate: (date: string | null) => void;
}

export default function SearchList({
  setSearchLabel,
  setSearchDate,
}: SearchListProps) {
  const { labelList } = useBoardStore();
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLabelSelect = (label: Label | null) => {
    if (selectedLabel?._id === label?._id) return;
    setSelectedLabel(label);
    setSearchLabel(label);
    setIsOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSearchDate(date); // 선택된 날짜로 필터링
  };

  return (
    <div className="relative w-1/4 flex items-center space-x-4">
      {/* 라벨 선택 */}
      <div className="flex-1">
        <div
          className="flex items-center justify-between cursor-pointer border p-2 rounded-lg shadow-md bg-white"
          onClick={toggleDropdown}
        >
          <span>
            {selectedLabel ? (
              <div className="flex items-center justify-center">
                <div
                  className={`w-4 h-4 mr-2 rounded-sm ${
                    selectedLabel._id === "67b9a48f67b4270871740d0b"
                      ? "bg-red-200"
                      : selectedLabel._id === "67b9a48f67b4270871740d0c"
                      ? "bg-sky-200"
                      : selectedLabel._id === "67b9a48f67b4270871740d0d"
                      ? "bg-green-200"
                      : selectedLabel._id === "67b9a48f67b4270871740d0e"
                      ? "bg-yellow-200"
                      : selectedLabel._id === "67b9a48f67b4270871740d0f"
                      ? "bg-indigo-200"
                      : ""
                  }`}
                ></div>
                {selectedLabel.title}
              </div>
            ) : (
              "전체 보기"
            )}
          </span>
          <span className="text-lg">▼</span>
        </div>

        {isOpen && (
          <div className="absolute w-full mt-2 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-10">
            <div
              className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => handleLabelSelect(null)}
            >
              <div className="w-4 h-4 mr-2 rounded-sm bg-black"></div>전체 보기
            </div>
            {labelList.map((label: Label) => (
              <div
                key={label._id}
                onClick={() => handleLabelSelect(label)}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              >
                <div
                  className={`w-4 h-4 mr-2 rounded-sm ${
                    label._id === "67b9a48f67b4270871740d0b"
                      ? "bg-red-200"
                      : label._id === "67b9a48f67b4270871740d0c"
                      ? "bg-sky-200"
                      : label._id === "67b9a48f67b4270871740d0d"
                      ? "bg-green-200"
                      : label._id === "67b9a48f67b4270871740d0e"
                      ? "bg-yellow-200"
                      : label._id === "67b9a48f67b4270871740d0f"
                      ? "bg-indigo-200"
                      : ""
                  }`}
                ></div>
                <span>{label.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 날짜 선택 */}
      <div className="flex-1">
        <input
          type="date"
          value={selectedDate || ""}
          onChange={handleDateChange}
          className="p-2 border rounded w-full"
        />
      </div>
    </div>
  );
}
