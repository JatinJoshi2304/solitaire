import React, { useState, useRef } from "react";
import { useDrag } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd";

const ItemTypes = {
  PAGE: "page",
};

interface PageType {
  id: number;
  front: string;
  back: string;
}

interface PageProps {
  page: PageType;
  isFlipped: boolean;
  onFlipForward: () => void;
  onFlipBackward: () => void;
}

const Page = ({
  page,
  isFlipped,
  onFlipForward,
  onFlipBackward,
}: PageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PAGE,
    item: { id: page.id },
    end: (item, monitor: DragSourceMonitor) => {
      if (!item) return;
      if (!monitor.didDrop()) {
        if (!isFlipped) onFlipForward();
        else onFlipBackward();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div
      ref={ref}
      className="page absolute w-64 h-96 cursor-pointer transition-transform duration-700"
      style={{
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
        transformOrigin: "left",
        zIndex: isFlipped ? page.id : 100 - page.id,
        opacity: isDragging ? 0.7 : 1,
      }}
      onClick={() => (!isFlipped ? onFlipForward() : onFlipBackward())}
      role="button"
      aria-pressed={isFlipped}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isFlipped) onFlipForward();
          else onFlipBackward();
        }
      }}
    >
      <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-md flex items-center justify-center text-2xl font-semibold">
        {page.front}
      </div>
      <div className="absolute w-full h-full backface-hidden bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-2xl font-semibold transform rotate-y-180">
        {page.back}
      </div>
    </div>
  );
};

const Book = () => {
  const pages: PageType[] = [
    { id: 1, front: "Page 1 Front", back: "Page 1 Back" },
    { id: 2, front: "Page 2 Front", back: "Page 2 Back" },
    { id: 3, front: "Page 3 Front", back: "Page 3 Back" },
    { id: 4, front: "Page 4 Front", back: "Page 4 Back" },
  ];

  const [flippedPages, setFlippedPages] = useState<number[]>([]);

  const flipForward = (pageId: number) => {
    setFlippedPages((prev) => [...prev, pageId]);
  };

  const flipBackward = (pageId: number) => {
    setFlippedPages((prev) => prev.filter((id) => id !== pageId));
  };

  return (
    <div
      className="book-perspective relative w-64 h-96 z-1"
      style={{ perspective: 1500 }}
    >
      {pages
        .sort((a, b) => b.id - a.id)
        .map((page) => (
          <Page
            key={page.id}
            page={page}
            isFlipped={flippedPages.includes(page.id)}
            onFlipForward={() => flipForward(page.id)}
            onFlipBackward={() => flipBackward(page.id)}
          />
        ))}
    </div>
  );
};

export default Book;
