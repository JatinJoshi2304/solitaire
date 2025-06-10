export default interface Player {
  _id: string;
  name: string;
  points: number;
  bet: number;
  roomId: string;
  isOwner: boolean;
  isReady: boolean;
  cards: string[];
}
