"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import GeolocationButton from "./geolocation-button"

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabd",
  "Parbhani",
  "Pimpri-Chinchwad",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
]

interface DistrictSelectorProps {
  selectedDistrict: string
  onDistrictChange: (district: string) => void
}

export default function DistrictSelector({ selectedDistrict, onDistrictChange }: DistrictSelectorProps) {
  return (
    <div className="space-y-3 bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <label className="text-lg font-semibold text-foreground">जिला चुनें</label>
        </div>
        <GeolocationButton onDistrictFound={onDistrictChange} />
      </div>
      <Select value={selectedDistrict} onValueChange={onDistrictChange}>
        <SelectTrigger className="w-full text-base h-12">
          <SelectValue placeholder="अपना जिला चुनें..." />
        </SelectTrigger>
        <SelectContent>
          {MAHARASHTRA_DISTRICTS.map((district) => (
            <SelectItem key={district} value={district} className="text-base">
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">महाराष्ट्र के किसी भी जिले का डेटा देखने के लिए चुनें</p>
    </div>
  )
}
