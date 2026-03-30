import { create, StateCreator } from 'zustand'
import { createShotSlice, ShotSlice, SEED_SHOTS } from './shotStore'
import { createWeightSlice, WeightSlice } from './weightStore'
import { createFoodSlice, FoodSlice } from './foodStore'
import { createSymptomSlice, SymptomSlice } from './symptomStore'
import { createBillSlice, BillSlice } from './billStore'
import { createExerciseSlice, ExerciseSlice } from './exerciseStore'
import { createWorkSlice, WorkSlice } from './workStore'
import { createSettingsSlice, SettingsSlice } from './settingsStore'
import { createPhotoSlice, PhotoSlice } from './photoStore'
import {
  dbShots, dbWeights, dbFoods, dbSymptoms,
  dbBills, dbBillPayments, dbExercises, dbWorkNotes,
  dbPhotos, dbSettings,
} from '../services/db'

export interface LoadSlice {
  loadAll: () => Promise<void>
}

export type AppStore = ShotSlice &
  WeightSlice &
  FoodSlice &
  SymptomSlice &
  BillSlice &
  ExerciseSlice &
  WorkSlice &
  SettingsSlice &
  PhotoSlice &
  LoadSlice

const createLoadSlice: StateCreator<AppStore, [], [], LoadSlice> = (set, get) => ({
  loadAll: async () => {
    const [
      shots, weights, foods, symptoms,
      bills, billPayments, exercises, workNotes,
      photos, settings,
    ] = await Promise.all([
      dbShots.fetchAll(),
      dbWeights.fetchAll(),
      dbFoods.fetchAll(),
      dbSymptoms.fetchAll(),
      dbBills.fetchAll(),
      dbBillPayments.fetchAll(),
      dbExercises.fetchAll(),
      dbWorkNotes.fetchAll(),
      dbPhotos.fetchAll(),
      dbSettings.fetch(),
    ])

    // Seed shots on first login if user has no shots yet
    let finalShots = shots
    if (shots.length === 0) {
      for (const shot of SEED_SHOTS) {
        await dbShots.insert(shot)
      }
      finalShots = SEED_SHOTS
    }

    set({
      shots: finalShots,
      weights,
      foods,
      symptoms,
      bills,
      billPayments,
      exercises,
      workNotes,
      photos,
      ...(settings ? { settings: { ...get().settings, ...settings } } : {}),
    })
  },
})

export const useStore = create<AppStore>()((...args) => ({
  ...createShotSlice(...args),
  ...createWeightSlice(...args),
  ...createFoodSlice(...args),
  ...createSymptomSlice(...args),
  ...createBillSlice(...args),
  ...createExerciseSlice(...args),
  ...createWorkSlice(...args),
  ...createSettingsSlice(...args),
  ...createPhotoSlice(...args),
  ...createLoadSlice(...args),
}))
