import { StateCreator } from 'zustand'
import { WeightEntry } from '../types/weight'
import { dbWeights } from '../services/db'

export interface WeightSlice {
  weights: WeightEntry[]
  addWeight: (entry: Omit<WeightEntry, 'id'>) => void
  updateWeight: (id: string, updates: Partial<WeightEntry>) => void
  deleteWeight: (id: string) => void
  getLatestWeight: () => WeightEntry | undefined
  getStartWeight: () => WeightEntry | undefined
}

export const createWeightSlice: StateCreator<WeightSlice> = (set, get) => ({
  weights: [],

  addWeight: (entry) => {
    const newEntry: WeightEntry = { ...entry, id: crypto.randomUUID() }
    set((s) => ({
      weights: [newEntry, ...s.weights].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }))
    dbWeights.insert(newEntry)
  },

  updateWeight: (id, updates) => {
    set((s) => ({
      weights: s.weights.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }))
    const updated = get().weights.find((w) => w.id === id)
    if (updated) dbWeights.update(updated)
  },

  deleteWeight: (id) => {
    set((s) => ({ weights: s.weights.filter((w) => w.id !== id) }))
    dbWeights.delete(id)
  },

  getLatestWeight: () => get().weights[0],
  getStartWeight: () => get().weights[get().weights.length - 1],
})
