import type { FC } from "react";
import { useRef } from "react";
import { useDrag } from "react-dnd";
import type { Card } from "../types/card";

interface Props {
  card: Card;
  index: number;
  vertical: boolean;
}

const DraggableCard: FC<Props> = ({ card, index = 0, vertical }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => ({ card, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const style = vertical
    ? { marginTop: index === 0 ? 0 : "-2rem", zIndex: index }
    : { marginLeft: index === 0 ? 0 : "-8.1rem", zIndex: index };

  return (
    <div
      ref={ref}
      className={`w-[130px] h-full relative bg-white border-1 border-gray-400 rounded-md shadow-xs flex items-center justify-center overflow-hidden mt:[${index}px]`}
      style={{
        opacity: isDragging ? 0 : 1,
        cursor: "move",
        ...style,

        bottom: `${index * 0.3}px`,
      }}
    >
      <img
        src={card.img}
        alt={`${card.rank} of ${card.suit}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default DraggableCard;
