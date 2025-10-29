"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsSummaryProps {
  data: {
    currentMonth: {
      personDays: number
      villages: number
      families: number
    }
    historicalData: Array<{
      month: string
      personDays: number
      families: number
      villages: number
    }>
  }
}

export default function StatsSummary({ data }: StatsSummaryProps) {
  if (!data.historicalData || data.historicalData.length < 2) return null

  const current = data.currentMonth
  const previous = data.historicalData[data.historicalData.length - 2]

  const personDaysChange = ((current.personDays - previous.personDays) / previous.personDays) * 100
  const familiesChange = ((current.families - previous.families) / previous.families) * 100
  const villagesChange = ((current.villages - previous.villages) / previous.villages) * 100

  const StatItem = ({
    label,
    change,
    icon: Icon,
  }: {
    label: string
    change: number
    icon: typeof TrendingUp
  }) => (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${change >= 0 ? "text-green-600" : "text-red-600"}`} />
      <span className="text-sm">
        <span className="font-semibold">{label}</span>
        <span className={`ml-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </span>
    </div>
  )

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">पिछले महीने से तुलना</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatItem
          label="कार्य दिवस"
          change={personDaysChange}
          icon={personDaysChange >= 0 ? TrendingUp : TrendingDown}
        />
        <StatItem label="परिवार" change={familiesChange} icon={familiesChange >= 0 ? TrendingUp : TrendingDown} />
        <StatItem label="गांव" change={villagesChange} icon={villagesChange >= 0 ? TrendingUp : TrendingDown} />
      </div>
    </Card>
  )
}
