import { StateCreator } from 'zustand'
import { WeightEntry } from '../types/weight'

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

  addWeight: (entry) =>
    set((s) => ({
      weights: [{ ...entry, id: crypto.randomUUID() }, ...s.weights].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    })),

  updateWeight: (id, updates) =>
    set((s) => ({
      weights: s.weights.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),

  deleteWeight: (id) =>
    set((s) => ({ weights: s.weights.filter((w) => w.id !== id) })),

  getLatestWeight: () => get().weights[0],

  getStartWeight: () => get().weights[get().weights.length - 1],
})
