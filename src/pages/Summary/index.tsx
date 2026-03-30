import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { ShotGauge } from '../../components/shots/ShotGauge'
import { MetricCard } from '../../components/ui/MetricCard'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { MedLevelChart, totalMedLevel } from '../../components/shots/MedLevelChart'
import { ShotFormModal } from '../Shots/ShotForm'
import { WeightFormModal } from '../Results/WeightForm'
import { FoodFormModal } from '../FoodLog/FoodForm'
import { SymptomFormModal } from '../Symptoms/SymptomForm'

export function SummaryPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const navigate = useNavigate()

  const [shotModalOpen, setShotModalOpen] = useState(false)
  const [weightModalOpen, setWeightModalOpen] = useState(false)
  const [calorieModalOpen, setCalorieModalOpen] = useState(false)
  const [symptomModalOpen, setSymptomModalOpen] = useState(false)
  const [dayNote, setDayNote] = useState('')

  const shots = useStore((s) => s.shots)
  const getLatestWeight = useStore((s) => s.getLatestWeight)
  const getStartWeight = useStore((s) => s.getStartWeight)
  const getDailyTotals = useStore((s) => s.getDailyTotals)
  const getSymptomsForDate = useStore((s) => s.getSymptomsForDate)
  const settings = useStore((s) => s.settings)

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const latestWeight = getLatestWeight()
  const startWeight = getStartWeight()
  const todayTotals = getDailyTotals(today)
  const todaySymptoms = getSymptomsForDate(todayStr)

  const totalChange = latestWeight && startWeight
    ? +(latestWeight.weightLbs - startWeight.weightLbs).toFixed(1)
    : null
  const percentChange = startWeight && totalChange !== null
    ? +((totalChange / startWeight.weightLbs) * 100).toFixed(1)
    : null
  const toGoal = latestWeight && settings.goalWeightLbs
    ? +(latestWeight.weightLbs - settings.goalWeightLbs).toFixed(1)
    : null
  const bmi = latestWeight && settings.heightInches
    ? +((latestWeight.weightLbs / (settings.heightInches ** 2)) * 703).toFixed(1)
    : null

  return (
    <div className="page-content">
      <PageHeader
        title="Summary"
        onMenuClick={openDrawer}
        action={
          <button
            onClick={() => setShotModalOpen(true)}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60"
          >
            <Plus size={16} />Add shot
          </button>
        }
      />

      {/* Shot Gauge Hero */}
      <ShotGauge onAddShot={() => setShotModalOpen(true)} />

      <div className="px-4 space-y-5 py-4">
        {/* Today's date + quick metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Today, {format(today, 'MMMM d')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <MetricCard
              icon="⚖️"
              label="Weight"
              value={latestWeight?.weightLbs}
              unit="lbs"
              onClick={() => setWeightModalOpen(true)}
            />
            <MetricCard
              icon="🥕"
              label="Calories"
              value={todayTotals.calories || undefined}
              onClick={() => setCalorieModalOpen(true)}
            />
            <MetricCard
              icon="🐟"
              label="Protein"
              value={todayTotals.proteinG || undefined}
              unit="g"
              onClick={() => setCalorieModalOpen(true)}
            />
          </div>
        </div>

        {/* Side effects */}
        <Card onClick={() => setSymptomModalOpen(true)}>
          <div className="flex items-center gap-2 mb-1">
            <span>🌊</span>
            <span className="text-sm font-semibold text-gray-700">Side effects</span>
          </div>
          {todaySymptoms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {todaySymptoms.flatMap(s => s.symptoms).slice(0, 5).map((sym, i) => (
                <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">{sym}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Tap to add side effects</p>
          )}
        </Card>

        {/* Notes for day */}
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <span>📋</span>
            <span className="text-sm font-semibold text-gray-700">Notes for day</span>
          </div>
          <textarea
            value={dayNote}
            onChange={(e) => setDayNote(e.target.value)}
            placeholder="Tap to add notes"
            className="w-full text-sm text-gray-600 placeholder-gray-400 resize-none outline-none mt-1 min-h-[36px]"
            rows={2}
          />
        </Card>

        {/* Results section */}
        <div>
          <SectionHeader title="Results" onSeeAll={() => navigate('/results')} />
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon="⚖️" label="Total change"
              value={totalChange !== null ? `${totalChange > 0 ? '+' : ''}${totalChange}` : '0'}
              unit="lb" />
            <StatCard icon="🧍" label="BMI"
              value={bmi ?? '—'} />
            <StatCard icon="⏱️" label="Weight"
              value={latestWeight ? `${latestWeight.weightLbs}` : '—'}
              unit="lb" />
            <StatCard icon="%" label="Percent"
              value={percentChange !== null ? `${percentChange}%` : '0%'} accent />
            <StatCard icon="⏳" label="Weekly avg"
              value="—" />
            <StatCard icon="🚩" label="To goal"
              value={toGoal !== null && settings.goalWeightLbs ? `${toGoal}lb` : '—'}
              unit={toGoal !== null && settings.goalWeightLbs ? `(${Math.abs(percentChange ?? 0)}%)` : ''} />
          </div>
        </div>

        {/* Shot History */}
        <div>
          <SectionHeader title="Shot History" onSeeAll={() => navigate('/shots')} />
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon="💉" label="Shots taken" value={shots.length} />
            <StatCard icon="📦" label="Last dose"
              value={shots[0] ? `${shots[0].dose}mg` : '—'} accent />
            <StatCard icon="📈" label="Est. level"
              value={`${totalMedLevel(shots, new Date()).toFixed(2)}mg`} />
          </div>
        </div>
      </div>

      {/* Estimated Medication Levels Chart — full-bleed below padding */}
      <div className="px-4 pb-2">
        <MedLevelChart shots={shots} />
      </div>

      <div className="px-4 space-y-5 pb-4">

        {/* Journey CTA */}
        <Card onClick={() => navigate('/results')} className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">View Your Slate Journey</p>
            <p className="text-sm text-gray-500 mt-0.5">See your all-time progress and achievements</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ backgroundColor: 'var(--accent-color)' }}>
            <span className="text-white text-lg">→</span>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ShotFormModal open={shotModalOpen} onClose={() => setShotModalOpen(false)} />
      <WeightFormModal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} />
      <FoodFormModal open={calorieModalOpen} onClose={() => setCalorieModalOpen(false)} />
      <SymptomFormModal open={symptomModalOpen} onClose={() => setSymptomModalOpen(false)} />
    </div>
  )
}
