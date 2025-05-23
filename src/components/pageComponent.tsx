import { useState, useRef } from "react";
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
      <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-md flex items-center justify-center text-2xl font-semibold  ">
        <span className="mx-12">{page.front}</span>
      </div>
      <div className="absolute w-full h-full backface-hidden bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-2xl font-semibold transform rotate-y-180">
        <span className="mx-12">{page.back}</span>
      </div>
    </div>
  );
};

const Book = () => {
  const pages: PageType[] = [
    {
      id: 1,
      front: "Drag cards and drop them into the correct zones.",
      back: "Flip book pages to reveal more content or hidden cards.",
    },
    {
      id: 2,
      front: "Use strategy or memory to match or sort cards.",
      back: "Complete all tasks to win the game.",
    },
    {
      id: 3,
      front: "Have fun and explore each page carefully!",
      back: "You can only move one card at a time—plan your moves wisely!",
    },
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
