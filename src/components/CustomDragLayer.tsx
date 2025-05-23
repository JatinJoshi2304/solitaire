import { useDragLayer } from "react-dnd";
import type { DragItem } from "../types/card";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
};

const getItemStyles = (initialOffset: any, currentOffset: any) => {
  if (!initialOffset || !currentOffset) return { display: "none" };

  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
    transition: "transform 0.3s ease-out",
  };
};

const CustomDragLayer = () => {
  const { item, isDragging, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem() as DragItem,
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  if (!isDragging || !item) return null;

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <img
          src={item.card.img}
          alt={`${item.card.rank} of ${item.card.suit}`}
          className="w-[130px] h-[180px] rounded shadow-lg border border-gray-300"
        />
      </div>
    </div>
  );
};

export default CustomDragLayer;
