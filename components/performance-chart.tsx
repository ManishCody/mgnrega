"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface PerformanceChartProps {
  data: Array<{
    month: string
    personDays: number
    families: number
    villages: number
  }>
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center bg-card border border-border">
        <p className="text-muted-foreground">कोई डेटा उपलब्ध नहीं है</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Line Chart - Person Days */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">कार्य दिवस (Person Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="personDays"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar Chart - Families & Villages */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">परिवार और गांव</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="families" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="villages" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
