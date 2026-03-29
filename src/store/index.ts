import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createShotSlice, ShotSlice } from './shotStore'
import { createWeightSlice, WeightSlice } from './weightStore'
import { createFoodSlice, FoodSlice } from './foodStore'
import { createSymptomSlice, SymptomSlice } from './symptomStore'
import { createBillSlice, BillSlice } from './billStore'
import { createExerciseSlice, ExerciseSlice } from './exerciseStore'
import { createWorkSlice, WorkSlice } from './workStore'
import { createSettingsSlice, SettingsSlice } from './settingsStore'
import { createPhotoSlice, PhotoSlice } from './photoStore'

export type AppStore = ShotSlice &
  WeightSlice &
  FoodSlice &
  SymptomSlice &
  BillSlice &
  ExerciseSlice &
  WorkSlice &
  SettingsSlice &
  PhotoSlice

export const useStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createShotSlice(...args),
      ...createWeightSlice(...args),
      ...createFoodSlice(...args),
      ...createSymptomSlice(...args),
      ...createBillSlice(...args),
      ...createExerciseSlice(...args),
      ...createWorkSlice(...args),
      ...createSettingsSlice(...args),
      ...createPhotoSlice(...args),
    }),
    {
      name: 'slate-storage',
      version: 1,
    }
  )
)
