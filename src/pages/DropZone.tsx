import type { FC } from "react";
import { useDrop } from "react-dnd";
import { useRef, useEffect } from "react";
import type { Card, DragItem } from "../types/card";

interface DropZoneProps {
  onDrop: (item: DragItem) => void;
  Icon: React.ComponentType<{ className?: string }>;
  color?: string;
  cards: Card[];
}
const DropZone: FC<DropZoneProps> = ({ onDrop, Icon, color, cards }) => {
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
      className={`h-full w-[130px] border rounded-lg flex flex-col items-center justify-center transition-all duration-300 ease-in-out
    ${
      isActive
        ? "bg-gradient-to-br from-white to-gray-100 shadow-[0_0_15px_5px_rgba(0,0,0,0.3)] border-2 border-white "
        : canDrop
        ? "bg-white border-2 border-green-600 opacity-70"
        : "bg-gray-200 border border-gray-400 shadow-inner shadow-black/20"
    }
  `}
    >
      {cards.length > 0 ? (
        cards.map((card, i) => (
          <div
            key={i}
            className="w-[130px] absolute mt-39 h-fit bg-red-600 text-white border-2 border-white rounded-md shadow-md flex flex-col items-center justify-center"
            style={{
              top: `${i * 5}%`,
              zIndex: i,
            }}
          >
            <img
              src={card.img}
              alt={`${card.rank} of ${card.suit}`}
              className="w-full h-full object-cover"
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
