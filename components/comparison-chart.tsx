"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface ComparisonChartProps {
  currentDistrict: string
  currentData: {
    personDays: number
    villages: number
    families: number
  }
}

// Sample data for comparison with other districts
const COMPARISON_DATA = {
  Ahmednagar: { personDays: 125000, villages: 450, families: 8500 },
  Nagpur: { personDays: 145000, villages: 520, families: 9200 },
  Pune: { personDays: 98000, villages: 380, families: 6800 },
  Aurangabad: { personDays: 115000, villages: 420, families: 7800 },
  Nashik: { personDays: 135000, villages: 490, families: 8800 },
}

export default function ComparisonChart({ currentDistrict, currentData }: ComparisonChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  // Prepare comparison data
  const comparisonChartData = [
    { district: currentDistrict, personDays: currentData.personDays, villages: currentData.villages },
    ...Object.entries(COMPARISON_DATA)
      .filter(([district]) => district !== currentDistrict)
      .slice(0, 4)
      .map(([district, data]) => ({
        district,
        personDays: data.personDays,
        villages: data.villages,
      })),
  ]

  const pieData = [
    { name: "कार्य दिवस", value: currentData.personDays },
    { name: "गांव", value: currentData.villages * 1000 },
    { name: "परिवार", value: currentData.families * 100 },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">जिलों की तुलना</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === "bar"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            तुलना
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === "pie"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            विभाजन
          </button>
        </div>
      </div>

      {chartType === "bar" ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="district" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="personDays" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="villages" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${(value / 1000).toFixed(0)}K`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
