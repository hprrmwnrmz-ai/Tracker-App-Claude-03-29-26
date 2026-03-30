import { StateCreator } from 'zustand'
import { ExerciseEntry } from '../types/exercise'
import { startOfWeek, endOfWeek } from 'date-fns'
import { dbExercises } from '../services/db'

export interface ExerciseSlice {
  exercises: ExerciseEntry[]
  addExercise: (entry: Omit<ExerciseEntry, 'id'>) => void
  updateExercise: (id: string, updates: Partial<ExerciseEntry>) => void
  deleteExercise: (id: string) => void
  getExercisesForDate: (dateStr: string) => ExerciseEntry[]
  getWeeklyStats: () => { count: number; totalMinutes: number }
}

export const createExerciseSlice: StateCreator<ExerciseSlice> = (set, get) => ({
  exercises: [],

  addExercise: (entry) => {
    const newEntry: ExerciseEntry = { ...entry, id: crypto.randomUUID() }
    set((s) => ({ exercises: [newEntry, ...s.exercises] }))
    dbExercises.insert(newEntry)
  },

  updateExercise: (id, updates) => {
    set((s) => ({ exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)) }))
    const updated = get().exercises.find((e) => e.id === id)
    if (updated) dbExercises.update(id, updated)
  },

  deleteExercise: (id) => {
    set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) }))
    dbExercises.delete(id)
  },

  getExercisesForDate: (dateStr) =>
    get().exercises.filter((e) => e.timestamp.startsWith(dateStr)),

  getWeeklyStats: () => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const weekly = get().exercises.filter((e) => {
      const d = new Date(e.timestamp)
      return d >= weekStart && d <= weekEnd
    })
    return {
      count: weekly.length,
      totalMinutes: weekly.reduce((sum, e) => sum + e.durationMinutes, 0),
    }
  },
})
