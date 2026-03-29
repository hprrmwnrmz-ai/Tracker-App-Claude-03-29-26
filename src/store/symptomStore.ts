import { StateCreator } from 'zustand'
import { SymptomEntry } from '../types/symptom'

export interface SymptomSlice {
  symptoms: SymptomEntry[]
  addSymptom: (entry: Omit<SymptomEntry, 'id'>) => void
  updateSymptom: (id: string, updates: Partial<SymptomEntry>) => void
  deleteSymptom: (id: string) => void
  getSymptomsForDate: (dateStr: string) => SymptomEntry[]
}

export const createSymptomSlice: StateCreator<SymptomSlice> = (set, get) => ({
  symptoms: [],

  addSymptom: (entry) =>
    set((s) => ({ symptoms: [{ ...entry, id: crypto.randomUUID() }, ...s.symptoms] })),

  updateSymptom: (id, updates) =>
    set((s) => ({ symptoms: s.symptoms.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),

  deleteSymptom: (id) =>
    set((s) => ({ symptoms: s.symptoms.filter((e) => e.id !== id) })),

  getSymptomsForDate: (dateStr) =>
    get().symptoms.filter((e) => e.timestamp.startsWith(dateStr)),
})
