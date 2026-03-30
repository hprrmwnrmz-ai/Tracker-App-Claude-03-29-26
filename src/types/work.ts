export interface WorkNote {
  id: string;
  timestamp: string; // ISO 8601
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
}
