"use client";

import { useMemo, useRef, useState } from "react";
import { BoardWithTodos, Label } from "../types";
import Board from "./Board";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import Slider from "./Slider";
import { addBoard } from "../actions/boards/addBoard.action";

interface BoardListProps {
  boardsWithTodos: BoardWithTodos[];
  labels: Label[];
}

export default function BoardList({ boardsWithTodos, labels }: BoardListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchLabel, setSearchLabel] = useState<Label | null>(null);
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | "">("");
  const [newBoardName, setNewBoardName] = useState<string | "">("");

  const filteredBoards = useMemo(() => {
    return boardsWithTodos
      .map((board) => {
        // board.title에 쿼리가 포함되었는지 확인
        const matchesBoardTitle = searchQuery
          ? board.title
              .replace(/\s/g, "")
              .includes(searchQuery.replace(/\s/g, ""))
          : true;

        // board.title에 쿼리가 포함된 경우, 모든 todos를 반환하고 label, date로 필터링
        if (matchesBoardTitle) {
          const filteredTodos = board.todos.filter((todo) => {
            const matchesLabel = searchLabel
              ? todo.label.id === searchLabel._id
              : true;
            const matchesDate = searchDate ? todo.date === searchDate : true;

            return matchesLabel && matchesDate;
          });

          // 필터링된 todos가 존재하면 해당 board 반환
          return { ...board, todos: filteredTodos };
        } else {
          // board.title에 쿼리가 포함되지 않으면, todo의 title이나 content도 필터링
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
          return { ...board, todos: filteredTodos };
        }
      })
      .filter((board) => board !== null)
      .sort((a, b) => a.order - b.order);
  }, [boardsWithTodos, searchLabel, searchQuery, searchDate]);

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) return alert("보드 이름을 입력하세요.");

    const response = await addBoard(newBoardName);

    if (response.success) {
      setNewBoardName("");
    } else {
      alert("보드 추가 실패: " + response.status);
    }
  };
  return (
    <div className="w-full h-95vh grid grid-rows-12 mt-4 bg-gray-100">
      <header className="row-span-1 bg-white shadow-md p-4 flex items-center border-b justify-end">
        <div className="h-1/2 flex items-center w-1/4">
          <div className="flex items-center border p-2 rounded-lg shadow-md bg-white mx-4">
            <input
              type="text"
              placeholder="보드 이름"
              className="p-2 w-full border-none outline-none"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
          </div>
          <button
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={handleAddBoard}
          >
            + 보드 추가
          </button>
        </div>
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

      {/* 좌우 버튼 & 보드 리스트 */}
      <div className="relative flex row-span-11 items-center ">
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
