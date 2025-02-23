"use client";

import { RefObject } from "react";
interface SliderProps {
  children: React.ReactNode;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}
export default function Slider({ children, scrollContainerRef }: SliderProps) {
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const boardWidth = scrollContainerRef.current.offsetWidth / 3 + 1;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -boardWidth : boardWidth,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <button
        className="absolute left-2 z-10 p-3 "
        onClick={() => scroll("left")}
      >
        ◀
      </button>

      {children}

      <button
        className="absolute right-2 z-10 p-3"
        onClick={() => scroll("right")}
      >
        ▶
      </button>
    </>
  );
}
