"use client";

import { useState } from "react";

interface SearchBarProps {
  setSearchQuery: (query: string | null) => void;
}

export default function SearchBar({ setSearchQuery }: SearchBarProps) {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchText(query);
    setSearchQuery(query ? query : null);
  };

  const handleSearchClear = () => {
    setSearchText("");
    setSearchQuery(null);
  };

  return (
    <div className="flex items-center border p-2 rounded-lg shadow-md bg-white w-1/2">
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요..."
        className="p-2 w-full border-none outline-none"
      />
      {searchText && (
        <button
          onClick={handleSearchClear}
          className="ml-2 text-2xl text-red-700 font-bold"
        >
          X
        </button>
      )}
    </div>
  );
}
