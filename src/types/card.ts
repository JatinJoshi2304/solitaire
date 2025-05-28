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

export interface Room {
  id: string;
  servername: string;
  players?: string[];
  owner?: string;
  status?: "waiting" | "playing" | "finished";
  isPasswordProtected: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}
