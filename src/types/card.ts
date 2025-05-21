export interface Card {
  suit: string;
  rank: string;
  value: number;
  code: string;
  img: string;
}

export interface DragItem {
  card: Card;
  index: number;
  type: string;
}
