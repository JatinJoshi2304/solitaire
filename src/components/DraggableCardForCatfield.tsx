import { useRef } from "react";
import { useDrag } from "react-dnd";

interface Props {
  card: any;
  index: number;
  vertical: boolean;
  width: number;
  height: number;
}

const DraggableCardForCatfield = ({ card, index = 0, vertical }: Props) => {
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
    : { marginLeft: index === 0 ? 0 : "-8.1em", zIndex: index };

  return (
    <div
      ref={ref}
      className={`w-[130px] h-[180px] relative bg-white border-1 border-gray-400 rounded-md shadow-xs flex items-center justify-center overflow-hidden mt:[${index}px]`}
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
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default DraggableCardForCatfield;
