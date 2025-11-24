export type Category = "environment" | "education" | "health" | "community" | "others";
export type Status = "open" | "closed";

export interface Activity {
  _id?: string;
  title: string;
  description: string;
  category: Category;
  organization: string;
  location: string;
  province: string;
  date: string;
  time: string;
  maxVolunteers: number;
  currentVolunteers: number;
  status: Status;
  tags: string[];
  imageUrl?: string;
  createdBy?: string;
}
