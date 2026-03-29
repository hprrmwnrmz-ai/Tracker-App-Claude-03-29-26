import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { WeightFormModal } from './WeightForm'
import { WeightEntry } from '../../types/weight'
import { formatDate } from '../../utils/formatters'

export function ResultsPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WeightEntry | undefined>()

  const weights = useStore((s) => s.weights)
  const deleteWeight = useStore((s) => s.deleteWeight)
  const settings = useStore((s) => s.settings)

  const chartData = [...weights]
    .reverse()
    .map((w) => ({ date: format(new Date(w.timestamp), 'M/d'), weight: w.weightLbs, id: w.id }))

  const latest = weights[0]
  const start = weights[weights.length - 1]
  const totalChange = latest && start ? +(latest.weightLbs - start.weightLbs).toFixed(1) : 0
  const toGoal = latest && settings.goalWeightLbs ? +(latest.weightLbs - settings.goalWeightLbs).toFixed(1) : null

  return (
    <div className="page-content">
      <PageHeader
        title="Results"
        onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Weight
          </button>
        }
      />

      <div className="px-4 py-4 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center" padding>
            <p className="text-xs text-gray-500">Start</p>
            <p className="text-lg font-bold text-gray-900">{start ? `${start.weightLbs}` : '—'}<span className="text-xs font-normal text-gray-400"> lb</span></p>
          </Card>
          <Card className="text-center" padding>
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-lg font-bold text-gray-900">{latest ? `${latest.weightLbs}` : '—'}<span className="text-xs font-normal text-gray-400"> lb</span></p>
          </Card>
          <Card className="text-center" padding>
            <p className="text-xs text-gray-500">Change</p>
            <p className={`text-lg font-bold ${totalChange < 0 ? 'text-green-600' : totalChange > 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {totalChange > 0 ? '+' : ''}{totalChange}<span className="text-xs font-normal text-gray-400"> lb</span>
            </p>
          </Card>
        </div>

        {/* Weight chart */}
        <Card>
          <SectionHeader title="Weight Over Time" />
          {chartData.length < 2 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              Log at least 2 weights to see chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`${val} lbs`, 'Weight']}
                />
                {settings.goalWeightLbs > 0 && (
                  <ReferenceLine y={settings.goalWeightLbs} stroke="#22c55e" strokeDasharray="4 4"
                    label={{ value: 'Goal', position: 'right', fontSize: 11, fill: '#22c55e' }} />
                )}
                <Line type="monotone" dataKey="weight" stroke="var(--accent-color)"
                  strokeWidth={2.5} dot={{ r: 3, fill: 'var(--accent-color)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Weight log */}
        <div>
          <SectionHeader title="Weight Log" />
          {weights.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No weight entries yet</div>
          )}
          <div className="space-y-2">
            {weights.map((w) => (
              <Card key={w.id} padding={false}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{w.weightLbs} lbs</p>
                    <p className="text-xs text-gray-500">{formatDate(w.timestamp)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(w); setModalOpen(true) }}
                      className="p-2 text-gray-400 active:opacity-60">
                      ✏️
                    </button>
                    <button onClick={() => deleteWeight(w.id)}
                      className="p-2 text-red-400 active:opacity-60">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <WeightFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  )
}
