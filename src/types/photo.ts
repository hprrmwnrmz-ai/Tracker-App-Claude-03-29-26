export interface PhotoEntry {
  id: string;
  timestamp: string; // ISO 8601
  caption: string;
  weightAtTime?: number;
  blobKey: string; // key in IndexedDB
}
