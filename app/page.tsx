"use client"

import { useState, useEffect } from "react"
import DistrictSelector from "@/components/district-selector"
import PerformanceChart from "@/components/performance-chart"
import ComparisonChart from "@/components/comparison-chart"
import StatsSummary from "@/components/stats-summary"
import DataCard from "@/components/data-card"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!selectedDistrict) return

    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/mgnrega?district=${selectedDistrict}`)
        if (!response.ok) throw new Error("डेटा लोड करने में विफल")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "एक त्रुटि हुई")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedDistrict])

  const handleRefresh = () => {
    if (selectedDistrict) {
      setLoading(true)
      setError("")
      fetch(`/api/mgnrega?district=${selectedDistrict}`)
        .then((res) => res.json())
        .then((result) => setData(result))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">हमारी आवाज़, हमारे अधिकार</h1>
          <p className="text-lg md:text-xl opacity-90">MGNREGA Program Performance Dashboard</p>
          <p className="text-sm md:text-base opacity-75 mt-2">महाराष्ट्र जिलों का प्रदर्शन डेटा</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* District Selector */}
        <div className="mb-8">
          <DistrictSelector selectedDistrict={selectedDistrict} onDistrictChange={setSelectedDistrict} />
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20 p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive font-medium text-sm md:text-base">{error}</p>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="p-12 text-center bg-card border border-border">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground text-lg">डेटा लोड हो रहा है...</p>
            </div>
          </Card>
        )}

        {/* Data Display */}
        {data && !loading && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Refresh Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                डेटा अपडेट करें
              </button>
            </div>

            {/* Current Month Stats */}
            <div>
              <h2 className="section-title">इस महीने का प्रदर्शन</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataCard
                  label="कार्य दिवस (Person Days)"
                  value={data.currentMonth?.personDays || 0}
                  icon="💼"
                  subtext="कुल कार्य दिवस"
                />
                <DataCard label="गांव" value={data.currentMonth?.villages || 0} icon="🏘️" subtext="सक्रिय गांव" />
                <DataCard
                  label="परिवार"
                  value={data.currentMonth?.families || 0}
                  icon="👨‍👩‍👧‍👦"
                  subtext="लाभार्थी परिवार"
                />
              </div>
            </div>

            {/* Stats Summary */}
            <StatsSummary data={data} />

            {/* Performance Chart */}
            <div>
              <h2 className="section-title">पिछले 6 महीने का प्रदर्शन</h2>
              <PerformanceChart data={data.historicalData} />
            </div>

            {/* Comparison Chart */}
            <ComparisonChart currentDistrict={data.district} currentData={data.currentMonth} />

            {/* Additional Info */}
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-semibold text-foreground">जिले की जानकारी</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">जिला</p>
                  <p className="text-lg font-semibold text-foreground">{data.district}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">अंतिम अपडेट</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(data.lastUpdated).toLocaleDateString("hi-IN")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Info Box */}
            <Card className="p-6 bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">MGNREGA के बारे में</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) ग्रामीण भारत में रोजगार के अवसर प्रदान करता है। यह
                डैशबोर्ड प्रत्येक जिले के प्रदर्शन को ट्रैक करता है।
              </p>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!selectedDistrict && !loading && (
          <Card className="p-12 text-center bg-card border border-border">
            <div className="mb-4 text-5xl">📍</div>
            <p className="text-xl font-semibold text-foreground mb-2">कृपया एक जिला चुनें</p>
            <p className="text-muted-foreground">महाराष्ट्र के किसी भी जिले का डेटा देखने के लिए ऊपर से चुनें</p>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">डेटा स्रोत</h4>
              <p className="text-sm text-muted-foreground">data.gov.in</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">कार्यक्रम</h4>
              <p className="text-sm text-muted-foreground">MGNREGA Performance Dashboard</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">परियोजना</h4>
              <p className="text-sm text-muted-foreground">Build For Bharat Fellowship</p>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>Our Voice, Our Rights - हमारी आवाज़, हमारे अधिकार</p>
            <p className="mt-2">© 2025 MGNREGA Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
