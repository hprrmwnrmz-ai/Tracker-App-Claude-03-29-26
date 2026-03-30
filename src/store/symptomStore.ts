import { StateCreator } from 'zustand'
import { SymptomEntry } from '../types/symptom'
import { dbSymptoms } from '../services/db'

export interface SymptomSlice {
  symptoms: SymptomEntry[]
  addSymptom: (entry: Omit<SymptomEntry, 'id'>) => void
  updateSymptom: (id: string, updates: Partial<SymptomEntry>) => void
  deleteSymptom: (id: string) => void
  getSymptomsForDate: (dateStr: string) => SymptomEntry[]
}

export const createSymptomSlice: StateCreator<SymptomSlice> = (set, get) => ({
  symptoms: [],

  addSymptom: (entry) => {
    const newEntry: SymptomEntry = { ...entry, id: crypto.randomUUID() }
    set((s) => ({ symptoms: [newEntry, ...s.symptoms] }))
    dbSymptoms.insert(newEntry)
  },

  updateSymptom: (id, updates) => {
    set((s) => ({ symptoms: s.symptoms.map((e) => (e.id === id ? { ...e, ...updates } : e)) }))
    const updated = get().symptoms.find((e) => e.id === id)
    if (updated) dbSymptoms.update(updated)
  },

  deleteSymptom: (id) => {
    set((s) => ({ symptoms: s.symptoms.filter((e) => e.id !== id) }))
    dbSymptoms.delete(id)
  },

  getSymptomsForDate: (dateStr) =>
    get().symptoms.filter((e) => e.timestamp.startsWith(dateStr)),
})
