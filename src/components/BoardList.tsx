"use client";

import { useEffect, useRef } from "react";
import { BoardWithTodos, Label } from "../types";
import Board from "./Board";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import { useBoardStore } from "../store/globalStore";

interface BoardListProps {
  boardsWithTodos: BoardWithTodos[];
  labels: Label[];
}

export default function BoardList({ boardsWithTodos, labels }: BoardListProps) {
  const { boards, setBoards, setLabels } = useBoardStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLabels(labels);
    if (boardsWithTodos.length > 0) {
      setBoards(boardsWithTodos);
    }
  }, [boardsWithTodos, labels]);

  // 보드 이동 (한 칸씩)
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const boardWidth = scrollContainerRef.current.offsetWidth / 4 + 1;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -boardWidth : boardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full h-95vh grid grid-rows-10 mt-4 bg-gray-100">
      {/*  검색 바 */}
      <div className="row-span-1 bg-white shadow-md p-4 flex items-center border-b">
        <SearchBar />
        <SearchList />
      </div>

      {/*  좌우 버튼 & 보드 리스트 */}
      <div className="relative row-span-9 flex items-center">
        <button
          className="absolute left-2 z-10 p-3 "
          onClick={() => scroll("left")}
        >
          ◀
        </button>

        <div
          ref={scrollContainerRef}
          className="flex w-full h-full overflow-x-auto py-6 scroll-smooth"
        >
          {boards.map((board) => (
            <div className="min-w-[25%] px-[2.5%]" key={board._id}>
              <Board data={board} />
            </div>
          ))}
        </div>

        <button
          className="absolute right-2 z-10 p-3"
          onClick={() => scroll("right")}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
