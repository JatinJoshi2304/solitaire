import { useDrop } from "react-dnd";
import { useRef, useEffect } from "react";
import type { Card, DragItem } from "../types/card";

interface DropZoneProps {
  onDrop: (item: DragItem) => void;
  Icon: React.ComponentType<{ className?: string }>;
  color?: string;
  cards: Card[];
}
const DropZone = ({ onDrop, Icon, color, cards }: DropZoneProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: DragItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);

  const isActive = isOver && canDrop;

  return (
    <div
      ref={ref}
      className={`w-[130px] h-[180px] border border-green-900 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ease-in-out 
    ${
      isActive
        ? "bg-gradient-to-br from-white to-gray-100 shadow-[0_0_15px_5px_rgba(0,0,0,0.3)] border-2 border-white "
        : ""
    }
  `}
    >
      {cards.length > 0 ? (
        cards.map((card, i) => (
          <div
            key={i}
            className="w-[130px] h-[180px]  absolute mt-45  bg-red-600 text-white  rounded-md shadow-md flex flex-col items-center justify-center"
            style={{
              top: `${i * 2.6}%`,
              zIndex: i,
            }}
          >
            <img
              src={card.img}
              alt={`${card.rank} of ${card.suit}`}
              className="w-full h-full object-cover border-1 border-gray-400 rounded-md shadow-md"
            />
          </div>
        ))
      ) : (
        <Icon
          className={`w-10 h-10 ${color ? `text-[${color}]` : "text-black"}`}
        />
      )}
    </div>
  );
};

export default DropZone;
