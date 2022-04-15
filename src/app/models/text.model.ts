import { User } from './user.model';

export interface Text {
  id: string;
  title: string;
  content: string | undefined;
  user: User;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
