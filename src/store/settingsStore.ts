import { StateCreator } from 'zustand'
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings'
import { dbSettings } from '../services/db'

export interface SettingsSlice {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  settings: DEFAULT_SETTINGS,

  updateSettings: (updates) => {
    set((s) => ({ settings: { ...s.settings, ...updates } }))
    // Pass the full merged settings to upsert
    dbSettings.upsert({ ...get().settings, ...updates })
  },
})
