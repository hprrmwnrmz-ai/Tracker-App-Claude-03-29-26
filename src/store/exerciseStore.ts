import { StateCreator } from 'zustand'
import { ExerciseEntry } from '../types/exercise'
import { format, startOfWeek, endOfWeek } from 'date-fns'

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

  addExercise: (entry) =>
    set((s) => ({ exercises: [{ ...entry, id: crypto.randomUUID() }, ...s.exercises] })),

  updateExercise: (id, updates) =>
    set((s) => ({ exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),

  deleteExercise: (id) =>
    set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) })),

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
