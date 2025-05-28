export default interface Player {
  _id: string;
  name: string;
  score: number;
  roomId: string;
  isOwner: boolean;
  isReady: boolean;
}
