"use client";

interface SearchBarProps {
  searchQuery: string | "";
  setSearchQuery: (query: string | "") => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query ? query : "");
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex items-center border p-2 rounded-lg shadow-md bg-white w-1/3 mx-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
        className="p-2 w-full border-none outline-none"
      />
      {searchQuery && (
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
