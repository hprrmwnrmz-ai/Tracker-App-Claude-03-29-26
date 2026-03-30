import { StateCreator } from 'zustand'
import { ShotEntry, InjectionSite, INJECTION_SITE_ROTATION } from '../types/shot'
import { dbShots } from '../services/db'

// Seed data from user's Zepbound history (imported on first login)
export const SEED_SHOTS: ShotEntry[] = [
  { id: 's1',  timestamp: '2025-12-31T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-left',  notes: '' },
  { id: 's2',  timestamp: '2026-01-07T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-right', notes: '' },
  { id: 's3',  timestamp: '2026-01-13T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-left',  notes: '' },
  { id: 's4',  timestamp: '2026-01-20T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-right', notes: '' },
  { id: 's5',  timestamp: '2026-01-27T10:00:00.000Z', dose: 3.25, site: 'thigh-left',          notes: '' },
  { id: 's6',  timestamp: '2026-02-03T10:00:00.000Z', dose: 3.25, site: 'thigh-right',         notes: '' },
  { id: 's7',  timestamp: '2026-02-10T10:00:00.000Z', dose: 3.25, site: 'upper-arm-left',      notes: '' },
  { id: 's8',  timestamp: '2026-02-17T10:00:00.000Z', dose: 3.25, site: 'upper-arm-right',     notes: '' },
  { id: 's9',  timestamp: '2026-02-24T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-left',  notes: '' },
  { id: 's10', timestamp: '2026-03-03T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-right', notes: '' },
  { id: 's11', timestamp: '2026-03-10T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-left',  notes: '' },
  { id: 's12', timestamp: '2026-03-17T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-right', notes: '' },
  { id: 's13', timestamp: '2026-03-23T10:00:00.000Z', dose: 5,    site: 'thigh-left',          notes: 'Dose increased to 5mg' },
  { id: 's14', timestamp: '2026-03-29T10:00:00.000Z', dose: 5,    site: 'thigh-right',         notes: '' },
]

export interface ShotSlice {
  shots: ShotEntry[]
  addShot: (shot: Omit<ShotEntry, 'id'>) => void
  updateShot: (id: string, updates: Partial<ShotEntry>) => void
  deleteShot: (id: string) => void
  getNextSite: () => InjectionSite
  getLastShot: () => ShotEntry | undefined
  getDaysSinceLastShot: () => number
  getDaysUntilNextShot: () => number
}

export const createShotSlice: StateCreator<ShotSlice> = (set, get) => ({
  shots: [],

  addShot: (shot) => {
    const newShot: ShotEntry = { ...shot, id: crypto.randomUUID() }
    set((s) => ({
      shots: [newShot, ...s.shots].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }))
    dbShots.insert(newShot)
  },

  updateShot: (id, updates) => {
    set((s) => ({
      shots: s.shots.map((sh) => (sh.id === id ? { ...sh, ...updates } : sh)),
    }))
    const updated = get().shots.find((sh) => sh.id === id)
    if (updated) dbShots.update(updated)
  },

  deleteShot: (id) => {
    set((s) => ({ shots: s.shots.filter((sh) => sh.id !== id) }))
    dbShots.delete(id)
  },

  getNextSite: () => {
    const { shots } = get()
    if (shots.length === 0) return INJECTION_SITE_ROTATION[0]
    const lastSite = shots[0].site
    const lastIdx = INJECTION_SITE_ROTATION.indexOf(lastSite)
    return INJECTION_SITE_ROTATION[(lastIdx + 1) % INJECTION_SITE_ROTATION.length]
  },

  getLastShot: () => get().shots[0],

  getDaysSinceLastShot: () => {
    const { shots } = get()
    if (shots.length === 0) return Infinity
    const last = new Date(shots[0].timestamp)
    return Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24))
  },

  getDaysUntilNextShot: () => 7 - get().getDaysSinceLastShot(),
})
