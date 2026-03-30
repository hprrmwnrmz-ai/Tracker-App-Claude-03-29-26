import { useOutletContext } from 'react-router-dom'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { ACCENT_COLOR_OPTIONS } from '../../types/settings'

export function SettingsPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)

  return (
    <div className="page-content">
      <PageHeader title="Settings" onMenuClick={openDrawer} />

      <div className="px-4 py-4 space-y-5">

        {/* Theme */}
        <div>
          <SectionHeader title="Appearance" />
          <Card>
            <p className="text-sm font-semibold text-gray-700 mb-3">Accent Color</p>
            <div className="flex gap-3">
              {ACCENT_COLOR_OPTIONS.map(({ label, value }) => (
                <button key={value} onClick={() => updateSettings({ accentColor: value })}
                  className={`w-10 h-10 rounded-full transition-transform ${settings.accentColor === value ? 'scale-110 ring-2 ring-offset-2' : ''}`}
                  style={{ backgroundColor: value, ['--tw-ring-color' as string]: value }}
                  title={label}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Health */}
        <div>
          <SectionHeader title="Zepbound" />
          <Card>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Dose (mg)</label>
                <input type="number" step="0.25"
                  value={settings.currentDose}
                  onChange={(e) => updateSettings({ currentDose: parseFloat(e.target.value) || 0 })}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shot Interval (days)</label>
                <input type="number" min="1" max="30" step="1"
                  value={settings.shotIntervalDays ?? 7}
                  onChange={(e) => updateSettings({ shotIntervalDays: parseInt(e.target.value) || 7 })}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
                <p className="text-xs text-gray-400 mt-1">How many days between injections (default: 7)</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
                <input type="date" value={settings.startDate}
                  onChange={(e) => updateSettings({ startDate: e.target.value })}
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Goals */}
        <div>
          <SectionHeader title="Goals" />
          <Card>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Goal Weight (lbs)</label>
                <input type="number" step="0.5"
                  value={settings.goalWeightLbs || ''}
                  onChange={(e) => updateSettings({ goalWeightLbs: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g. 155"
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Height (inches, for BMI)</label>
                <input type="number"
                  value={settings.heightInches || ''}
                  onChange={(e) => updateSettings({ heightInches: parseFloat(e.target.value) || undefined })}
                  placeholder="e.g. 65"
                  className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* About */}
        <div>
          <SectionHeader title="About" />
          <Card>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-gray-900 tracking-tight">Slate</p>
              <p className="text-xs text-gray-400 mt-1">A clean slate every day</p>
              <p className="text-xs text-gray-300 mt-3">v1.0.0 · Personal use only</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
