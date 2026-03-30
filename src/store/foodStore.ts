import { StateCreator } from 'zustand'
import { FoodEntry } from '../types/food'
import { format } from 'date-fns'
import { dbFoods } from '../services/db'

export interface FoodSlice {
  foods: FoodEntry[]
  addFood: (entry: Omit<FoodEntry, 'id'>) => void
  updateFood: (id: string, updates: Partial<FoodEntry>) => void
  deleteFood: (id: string) => void
  getFoodsForDate: (date: Date) => FoodEntry[]
  getDailyTotals: (date: Date) => { calories: number; proteinG: number; carbsG: number; fatG: number }
}

export const createFoodSlice: StateCreator<FoodSlice> = (set, get) => ({
  foods: [],

  addFood: (entry) => {
    const newEntry: FoodEntry = { ...entry, id: crypto.randomUUID() }
    set((s) => ({ foods: [newEntry, ...s.foods] }))
    dbFoods.insert(newEntry)
  },

  updateFood: (id, updates) => {
    set((s) => ({ foods: s.foods.map((f) => (f.id === id ? { ...f, ...updates } : f)) }))
    const updated = get().foods.find((f) => f.id === id)
    if (updated) dbFoods.update(updated)
  },

  deleteFood: (id) => {
    set((s) => ({ foods: s.foods.filter((f) => f.id !== id) }))
    dbFoods.delete(id)
  },

  getFoodsForDate: (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return get().foods.filter((f) => f.timestamp.startsWith(dateStr))
  },

  getDailyTotals: (date) => {
    const entries = get().getFoodsForDate(date)
    return entries.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        proteinG: acc.proteinG + f.proteinG,
        carbsG: acc.carbsG + f.carbsG,
        fatG: acc.fatG + f.fatG,
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    )
  },
})
