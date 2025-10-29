"use client"

import { useState } from "react"
import { useGeolocation, findNearestDistrict } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

interface GeolocationButtonProps {
  onDistrictFound: (district: string) => void
}

export default function GeolocationButton({ onDistrictFound }: GeolocationButtonProps) {
  const { coordinates, loading, error } = useGeolocation()
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    if (coordinates) {
      const district = findNearestDistrict(coordinates)
      if (district) {
        onDistrictFound(district)
      }
    }
  }

  if (error) {
    return null
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading || !coordinates || clicked}
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          स्थान खोज रहे हैं...
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4" />
          मेरा जिला खोजें
        </>
      )}
    </Button>
  )
}
