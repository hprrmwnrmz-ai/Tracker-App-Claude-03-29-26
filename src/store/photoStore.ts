import { StateCreator } from 'zustand'
import { PhotoEntry } from '../types/photo'

export interface PhotoSlice {
  photos: PhotoEntry[]
  addPhoto: (entry: Omit<PhotoEntry, 'id'>) => void
  deletePhoto: (id: string) => void
}

export const createPhotoSlice: StateCreator<PhotoSlice> = (set) => ({
  photos: [],

  addPhoto: (entry) =>
    set((s) => ({ photos: [{ ...entry, id: crypto.randomUUID() }, ...s.photos] })),

  deletePhoto: (id) =>
    set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
})
