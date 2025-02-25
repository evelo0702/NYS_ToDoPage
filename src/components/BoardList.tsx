"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Board, Label } from "../types";
import BoardComponent from "./BoardComponent";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import { useBoardStore } from "../store/globalStore";
import { filterBoards } from "../lib/filterBoards";
import { v4 as uuidv4 } from "uuid";
import Xslider from "../components/Xslider";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import BoardOrderChangeModal from "./BoardOrderChangeModal";
import { TfiSave } from "react-icons/tfi";
import { syncBoards } from "../actions/boards/syncBoards.action";
import { getBoardsAction } from "../actions/boards/getBoards.action";

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
  const {
    syncBoardsWithServer,
    boards,
    setBoards,
    setLabels,
    addBoard,
    undo,
    redo,
    past,
    future,
  } = useBoardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    const handleSync = async () => {
      if (boards.length > 0) {
        try {
          await syncBoards(boards);
          const res = await getBoardsAction();
          console.log(res);
          console.log("자동 저장 완료");
        } catch (error) {
          console.error("자동 저장 중 오류 발생", error);
        }
      }
    };

    const beforeUnloadHandler = () => {
      handleSync();
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      handleSync();
    };
  }, [boards]);

  return (
    <div className="w-full h-95vh grid grid-rows-12 mt-4  rounded-md">
      <div className="row-span-1   p-4 flex items-center  justify-between border-b border-gray-400">
        <button
          className="flex text-xl h-full  p-2 rounded-md items-center ms-4  font-bold  bg-gray-100 text-black"
          onClick={syncBoardsWithServer}
        >
          <TfiSave />
          <p className="ms-2">Todo 저장하기</p>
        </button>
        <div className="w-3/4 flex justify-end h-full">
          <button
            className="me-2 font-bold  rounded-md p-2 bg-gray-100 text-black"
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
          />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      <div className="row-span-1 flex justify-between items-center px-8 border-b border-gray-40 ">
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
            <FaArrowRotateLeft />
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
            <FaArrowRotateRight />
          </button>
        </div>
        <div className="flex  w-1/2 justify-end">
          <input
            type="text"
            placeholder="보드 이름"
            className="p-2 rounded-md w-1/3 border border-gray-400"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button
            className="p-2 w-1/6 bg-gray-100 text-black font-bold  rounded-md"
            onClick={handleAddBoard}
          >
            + 보드 추가
          </button>
          <button
            className="p-2 w-1/5 ms-4 bg-gray-100 text-black font-bold    rounded-md transition"
            onClick={() => setIsModalOpen(true)}
          >
            보드 순서 변경
          </button>
        </div>
      </div>

      {/* 좌우 버튼 & 보드 리스트 */}
      <div className="relative flex row-span-10 items-center ">
        {filteredBoards.length > 0 ? (
          <Xslider scrollContainerRef={scrollContainerRef}>
            <div
              ref={scrollContainerRef}
              className="flex w-full h-full overflow-x-auto py-6 scroll-smooth ps-3"
            >
              {filteredBoards.map((board) => (
                <div
                  className="min-w-[30%] mx-[1.5%]"
                  key={`${board._id}-${board.title}-${board.todos[0]._id}`}
                >
                  <BoardComponent data={board} />
                </div>
              ))}
            </div>
          </Xslider>
        ) : (
          <div className="flex justify-center items-center w-full h-full text-center text-gray-600 bg-gray-200 rounded-lg shadow-lg">
            <p className="text-xl font-semibold">작성된 Todo가 없습니다</p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <BoardOrderChangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          boards={boards}
        />
      )}
    </div>
  );
}
