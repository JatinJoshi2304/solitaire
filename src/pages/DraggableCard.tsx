import type { FC } from "react";
import { useRef } from "react";
import { useDrag } from "react-dnd";
import type { Card, DragItem } from "../types/card";

interface Props {
  card: Card;
  index: number;
  vertical: boolean;
}

const DraggableCard: FC<Props> = ({ card, index = 0, vertical }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { card, index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  const style = vertical
    ? { marginTop: index === 0 ? 0 : "-2rem", zIndex: index }
    : { marginLeft: index === 0 ? 0 : "-8.1rem", zIndex: index };

  return (
    <div
      ref={ref}
      className="w-[130px] h-full bg-white border-2 border-gray-300 rounded-md shadow-md flex items-center justify-center overflow-hidden"
      style={{
        opacity: isDragging ? 0 : 1,
        cursor: "move",
        ...style,
      }}
    >
      <img
        src={card.img}
        alt={`${card.rank} of ${card.suit}`}
        className="w-full h-full object-cover"
        // style={{
        //   transform: vertical ? "rotate(90deg)" : "rotate(0deg)",
        //   transition: "transform 0.2s ease",
        // }}
      />
    </div>
  );
};

export default DraggableCard;
