"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BoardWithTodos, Label } from "../types";
import Board from "./Board";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import { useBoardStore } from "../store/globalStore";
import Slider from "./Slider";

interface BoardListProps {
  boardsWithTodos: BoardWithTodos[];
  labels: Label[];
}

export default function BoardList({ boardsWithTodos, labels }: BoardListProps) {
  const { boards, setBoards, setLabels } = useBoardStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchLabel, setSearchLabel] = useState<Label | null>(null);
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | "">("");

  useEffect(() => {
    setLabels(labels);
    if (boardsWithTodos.length > 0) {
      setBoards(boardsWithTodos);
    }
  }, [boardsWithTodos, labels]);

  const filteredBoards = useMemo(() => {
    return boards
      .map((board) => {
        // board.title에 쿼리가 포함되었는지 확인
        const matchesBoardTitle = searchQuery
          ? board.title
              .replace(/\s/g, "")
              .includes(searchQuery.replace(/\s/g, ""))
          : true;

        // board.title에 쿼리가 포함된 경우, 모든 todos를 반환하면서 label, date로만 필터링
        if (matchesBoardTitle) {
          const filteredTodos = board.todos.filter((todo) => {
            const matchesLabel = searchLabel
              ? todo.label.id === searchLabel._id
              : true;
            const matchesDate = searchDate ? todo.date === searchDate : true;

            return matchesLabel && matchesDate;
          });

          // 필터링된 todos가 존재하면 해당 board 반환
          if (filteredTodos.length > 0) {
            return { ...board, todos: filteredTodos };
          }
        } else {
          // board.title에 쿼리가 포함되지 않으면, todo의 title이나 content로 필터링
          const filteredTodos = board.todos.filter((todo) => {
            const matchesLabel = searchLabel
              ? todo.label.id === searchLabel._id
              : true;
            const matchesQuery = searchQuery
              ? todo.title
                  .replace(/\s/g, "")
                  .includes(searchQuery.replace(/\s/g, "")) ||
                todo.content
                  .replace(/\s/g, "")
                  .includes(searchQuery.replace(/\s/g, ""))
              : true;
            const matchesDate = searchDate ? todo.date === searchDate : true;

            return matchesLabel && matchesQuery && matchesDate;
          });

          // 필터링된 todos가 존재하면 해당 board 반환
          if (filteredTodos.length > 0) {
            return { ...board, todos: filteredTodos };
          }
        }

        // 모두 필터링되어 없을 경우, null 반환
        return null;
      })
      .filter((board) => board !== null); // null은 제외
  }, [boards, searchLabel, searchQuery, searchDate]);

  return (
    <div className="w-full h-95vh grid grid-rows-10 mt-4 bg-gray-100">
      {/* 검색 바 */}
      <div className="row-span-1 bg-white shadow-md p-4 flex items-center border-b justify-end">
        <button
          className="me-4 hover:bg-blue-200 p-2 rounded-md"
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
        />{" "}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* 좌우 버튼 & 보드 리스트 */}
      <div className="relative row-span-9 flex items-center">
        {filteredBoards.length > 0 ? (
          <Slider scrollContainerRef={scrollContainerRef}>
            <div
              ref={scrollContainerRef}
              className="flex w-full h-full overflow-x-auto py-6 scroll-smooth"
            >
              {filteredBoards.map((board) => (
                <div className="min-w-[30%] mx-[1.5%]" key={board._id}>
                  <Board data={board} />
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
