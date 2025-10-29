import { Card } from "@/components/ui/card"

interface DataCardProps {
  label: string
  value: number | string
  icon?: string
  subtext?: string
}

export default function DataCard({ label, value, icon, subtext }: DataCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-all duration-200 border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-4xl font-bold text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
        </div>
        {icon && <span className="text-4xl flex-shrink-0">{icon}</span>}
      </div>
    </Card>
  )
}
