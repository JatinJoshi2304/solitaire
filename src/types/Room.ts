export default interface Room {
  _id: string;
  serverName: string;
  code?: string;
  isPasswordProtected: boolean;
}
