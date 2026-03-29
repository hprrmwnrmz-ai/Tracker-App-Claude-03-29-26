import { StateCreator } from 'zustand'
import { WorkNote } from '../types/work'

export interface WorkSlice {
  workNotes: WorkNote[]
  addWorkNote: (note: Omit<WorkNote, 'id'>) => void
  updateWorkNote: (id: string, updates: Partial<WorkNote>) => void
  deleteWorkNote: (id: string) => void
  getWorkNotesForDate: (dateStr: string) => WorkNote[]
  searchWorkNotes: (query: string) => WorkNote[]
}

export const createWorkSlice: StateCreator<WorkSlice> = (set, get) => ({
  workNotes: [],

  addWorkNote: (note) =>
    set((s) => ({ workNotes: [{ ...note, id: crypto.randomUUID() }, ...s.workNotes] })),

  updateWorkNote: (id, updates) =>
    set((s) => ({ workNotes: s.workNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)) })),

  deleteWorkNote: (id) =>
    set((s) => ({ workNotes: s.workNotes.filter((n) => n.id !== id) })),

  getWorkNotesForDate: (dateStr) =>
    get().workNotes.filter((n) => n.timestamp.startsWith(dateStr)),

  searchWorkNotes: (query) => {
    const q = query.toLowerCase()
    return get().workNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    )
  },
})
