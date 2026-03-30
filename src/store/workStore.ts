import { StateCreator } from 'zustand'
import { WorkNote } from '../types/work'
import { dbWorkNotes } from '../services/db'

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

  addWorkNote: (note) => {
    const newNote: WorkNote = { ...note, id: crypto.randomUUID() }
    set((s) => ({ workNotes: [newNote, ...s.workNotes] }))
    dbWorkNotes.insert(newNote)
  },

  updateWorkNote: (id, updates) => {
    set((s) => ({ workNotes: s.workNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)) }))
    const updated = get().workNotes.find((n) => n.id === id)
    if (updated) dbWorkNotes.update(id, updated)
  },

  deleteWorkNote: (id) => {
    set((s) => ({ workNotes: s.workNotes.filter((n) => n.id !== id) }))
    dbWorkNotes.delete(id)
  },

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
