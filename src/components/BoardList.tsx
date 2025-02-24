"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Board, Label } from "../types";
import BoardComponent from "./BoardComponent";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import Slider from "./Slider";
import { useBoardStore } from "../store/globalStore";
import { filterBoards } from "../lib/filteredBoards";
import { v4 as uuidv4 } from "uuid";

interface BoardListProps {
  BoardsData: Board[] | null;
  labels: Label[];
}

export default function BoardList({ BoardsData, labels }: BoardListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchLabel, setSearchLabel] = useState<Label | null>(null);
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | "">("");
  const [newBoardName, setNewBoardName] = useState<string | "">("");

  const { boards, setBoards, setLabels, addBoard, undo, redo, past, future } =
    useBoardStore();

  useEffect(() => {
    if (BoardsData && labels) {
      setBoards(BoardsData);
      setLabels(labels);
    }
  }, [BoardsData, labels, setBoards, setLabels]);

  const filteredBoards = useMemo(() => {
    return filterBoards(boards, searchLabel, searchQuery, searchDate);
  }, [boards, searchLabel, searchQuery, searchDate]);

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return alert("보드 이름을 입력하세요.");
    const newBoard = {
      _id: uuidv4(),
      title: newBoardName,
      order: boards.length,
      todos: [],
    };
    addBoard(newBoard);
    setNewBoardName("");
  };

  return (
    <div className="w-full h-95vh grid grid-rows-12 mt-4 bg-gray-100">
      <header className="row-span-1 bg-white shadow-md p-4 flex items-center border-b justify-end">
        <div className="w-3/4 flex justify-end">
          <button
            className="me-2 hover:bg-blue-200 p-2 rounded-md"
            onClick={() => {
              setSearchDate(null);
              setSearchLabel(null);
              setSearchQuery("");
            }}
          >
            모두 보기
          </button>
          <SearchList
            searchLabel={searchLabel}
            searchDate={searchDate}
            setSearchLabel={setSearchLabel}
            setSearchDate={setSearchDate}
            labels={labels}
          />{" "}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </header>
      <div className="row-span-1 flex justify-between items-center px-8 ">
        <div>
          <button
            disabled={past.length === 0}
            className={`${
              past.length === 0
                ? "bg-black text-white cursor-not-allowed opacity-50"
                : "bg-white text-black "
            } border border-black py-2 px-6 rounded-lg transition duration-300 me-2`}
            onClick={undo}
          >
            실행 취소
          </button>
          <button
            disabled={future.length === 0}
            className={`${
              future.length === 0
                ? "bg-black text-white cursor-not-allowed opacity-50"
                : "bg-white text-black "
            } border border-black py-2 px-6 rounded-lg transition duration-300`}
            onClick={redo}
          >
            재실행
          </button>
        </div>
        <div className="flex border shadow-md w-1/4">
          <input
            type="text"
            placeholder="보드 이름"
            className="p-2 w-full border-none outline-none rounded-lg"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button
            className="p-2 w-1/2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={handleAddBoard}
          >
            + 보드 추가
          </button>
        </div>
      </div>

      {/* 좌우 버튼 & 보드 리스트 */}
      <div className="relative flex row-span-10 items-center">
        {filteredBoards.length > 0 ? (
          <Slider scrollContainerRef={scrollContainerRef}>
            <div
              ref={scrollContainerRef}
              className="flex w-full h-full overflow-x-auto py-6 scroll-smooth"
            >
              {filteredBoards.map((board) => (
                <div
                  className="min-w-[30%] mx-[1.5%]"
                  key={`${board._id}-${board.title}`}
                >
                  <BoardComponent data={board} />
                </div>
              ))}
            </div>
          </Slider>
        ) : (
          <div className="flex justify-center items-center w-full h-full text-center text-gray-600 bg-gray-200 rounded-lg shadow-lg">
            <p className="text-xl font-semibold">작성된 Todo가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
