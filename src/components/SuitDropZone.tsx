import type { FC } from "react";
import type { Card } from "../types/card";
import DropZone from "./DropZone";

const SuitDropZone = ({
  cards,
  onDrop,
  Icon,
  color,
}: {
  cards: Card[];
  onDrop: (item: { card: Card }) => void;
  Icon: FC;
  color?: string;
}) => (
  <div
    className={`h-full w-fit  border border-gray-600 rounded-lg shadow-inner shadow-black/30 flex flex-col items-center justify-center ${
      cards.length >= 13 ? "pointer-events-none opacity-50" : ""
    }`}
  >
    <DropZone onDrop={onDrop} Icon={Icon} color={color} cards={cards} />
  </div>
);

export default SuitDropZone;
