import { StateCreator } from 'zustand'
import { PhotoEntry } from '../types/photo'
import { dbPhotos } from '../services/db'

export interface PhotoSlice {
  photos: PhotoEntry[]
  addPhoto: (entry: Omit<PhotoEntry, 'id'> & { id?: string }) => void
  deletePhoto: (id: string) => void
}

export const createPhotoSlice: StateCreator<PhotoSlice> = (set) => ({
  photos: [],

  addPhoto: (entry) => {
    const newEntry: PhotoEntry = { ...entry, id: entry.id ?? crypto.randomUUID() }
    set((s) => ({ photos: [newEntry, ...s.photos] }))
    dbPhotos.insert(newEntry)
  },

  deletePhoto: (id) => {
    set((s) => ({ photos: s.photos.filter((p) => p.id !== id) }))
    dbPhotos.delete(id)
  },
})
