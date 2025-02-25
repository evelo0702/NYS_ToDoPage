"use client";

import { RefObject } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

interface SliderProps {
  children: React.ReactNode;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}
export default function Xslider({ children, scrollContainerRef }: SliderProps) {
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const boardWidth = scrollContainerRef.current.offsetWidth / 3;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -boardWidth : boardWidth,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <button
        className="absolute left-0 z-10 p-3 text-2xl"
        onClick={() => scroll("left")}
      >
        <BiSolidLeftArrow />
      </button>

      {children}

      <button
        className="absolute right-0 z-10 p-3 text-2xl"
        onClick={() => scroll("right")}
      >
        <BiSolidRightArrow />
      </button>
    </>
  );
}
