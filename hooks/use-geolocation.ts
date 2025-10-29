"use client"

import { useState, useEffect } from "react"

interface GeolocationCoordinates {
  latitude: number
  longitude: number
}

interface UseGeolocationReturn {
  coordinates: GeolocationCoordinates | null
  loading: boolean
  error: string | null
}

// Mapping of approximate coordinates to Maharashtra districts
const DISTRICT_COORDINATES: Record<string, GeolocationCoordinates> = {
  Ahmednagar: { latitude: 19.0876, longitude: 74.7421 },
  Akola: { latitude: 20.7136, longitude: 77.0091 },
  Amravati: { latitude: 20.8449, longitude: 77.7539 },
  Aurangabad: { latitude: 19.8762, longitude: 75.3433 },
  Beed: { latitude: 19.2183, longitude: 75.7597 },
  Bhandara: { latitude: 21.1458, longitude: 79.2533 },
  Buldhana: { latitude: 20.5244, longitude: 76.1761 },
  Chandrapur: { latitude: 19.9689, longitude: 79.3047 },
  Dhule: { latitude: 20.9217, longitude: 74.7597 },
  Gadchiroli: { latitude: 20.1833, longitude: 80.0 },
  Gondia: { latitude: 21.4667, longitude: 80.2 },
  Hingoli: { latitude: 19.7333, longitude: 77.1333 },
  Jalgaon: { latitude: 21.1458, longitude: 75.5625 },
  Jalna: { latitude: 19.8427, longitude: 75.8789 },
  Kolhapur: { latitude: 16.705, longitude: 73.7421 },
  Latur: { latitude: 18.4088, longitude: 76.5244 },
  "Mumbai City": { latitude: 19.076, longitude: 72.8777 },
  "Mumbai Suburban": { latitude: 19.1136, longitude: 72.8697 },
  Nagpur: { latitude: 21.1458, longitude: 79.0882 },
  Nanded: { latitude: 19.1383, longitude: 77.3267 },
  Nandurbar: { latitude: 21.3833, longitude: 74.2667 },
  Nashik: { latitude: 19.9975, longitude: 73.7898 },
  Osmanabd: { latitude: 17.3589, longitude: 76.7304 },
  Parbhani: { latitude: 19.2683, longitude: 76.7597 },
  "Pimpri-Chinchwad": { latitude: 18.6298, longitude: 73.7997 },
  Pune: { latitude: 18.5204, longitude: 73.8567 },
  Raigad: { latitude: 18.5912, longitude: 73.4556 },
  Ratnagiri: { latitude: 16.9891, longitude: 73.3167 },
  Sangli: { latitude: 16.8554, longitude: 74.5745 },
  Satara: { latitude: 17.6726, longitude: 73.9258 },
  Sindhudurg: { latitude: 15.9281, longitude: 73.9597 },
  Solapur: { latitude: 17.6599, longitude: 75.9064 },
  Thane: { latitude: 19.2183, longitude: 72.9781 },
  Wardha: { latitude: 20.7426, longitude: 78.6115 },
  Washim: { latitude: 20.1089, longitude: 77.5244 },
  Yavatmal: { latitude: 20.4183, longitude: 78.1364 },
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
  }, [])

  return { coordinates, loading, error }
}

// Function to find nearest district based on coordinates
export function findNearestDistrict(coordinates: GeolocationCoordinates): string | null {
  let nearestDistrict: string | null = null
  let minDistance = Number.POSITIVE_INFINITY

  Object.entries(DISTRICT_COORDINATES).forEach(([district, coords]) => {
    const distance = Math.sqrt(
      Math.pow(coordinates.latitude - coords.latitude, 2) + Math.pow(coordinates.longitude - coords.longitude, 2),
    )

    if (distance < minDistance) {
      minDistance = distance
      nearestDistrict = district
    }
  })

  return nearestDistrict
}
