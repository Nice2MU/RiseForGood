export interface ChatMessage {
  _id?: string;
  activity: string;
  user: string | null;
  userName: string;
  text: string;
  createdAt: string;
}
