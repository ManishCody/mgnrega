import { type NextRequest, NextResponse } from "next/server"

const DATA_GOV_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
const DATA_GOV_ENDPOINT = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722"

interface MGNREGARecord {
  fin_year: string
  month: string
  state_name: string
  district_name: string
  Persondays_of_Central_Liability_so_far: number
  Total_Households_Worked: number
  Total_No_of_Active_Workers: number
  Number_of_Completed_Works: number
  Number_of_Ongoing_Works: number
  Women_Persondays: number
  Total_Individuals_Worked: number
  Average_days_of_employment_provided_per_Household: number
  [key: string]: any
}

interface TransformedData {
  district: string
  currentMonth: {
    personDays: number
    villages: number
    families: number
    activeWorkers: number
    completedWorks: number
    ongoingWorks: number
    womenPersonDays: number
    avgDaysPerHousehold: number
  }
  historicalData: Array<{
    month: string
    personDays: number
    families: number
    villages: number
  }>
  lastUpdated: string
}

async function fetchFromDataGov(district: string): Promise<MGNREGARecord[]> {
  try {
    // Fetch current financial year data for Maharashtra
    const params = new URLSearchParams({
      "api-key": DATA_GOV_API_KEY,
      format: "json",
      "filters[state_name]": "MAHARASHTRA",
      "filters[district_name]": district.toUpperCase(),
      limit: "100",
    })

    const response = await fetch(`${DATA_GOV_ENDPOINT}?${params}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error(`[v0] API Error: ${response.status}`)
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()
    console.log(`[v0] Fetched ${data.records?.length || 0} records for ${district}`)
    return data.records || []
  } catch (error) {
    console.error(`[v0] Error fetching from data.gov.in:`, error)
    throw error
  }
}

function transformData(records: MGNREGARecord[]): TransformedData | null {
  if (!records || records.length === 0) {
    console.log("[v0] No records found")
    return null
  }

  // Sort by month to get the most recent data
  const sortedRecords = [...records].sort((a, b) => {
    const monthOrder = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
  })

  const currentRecord = sortedRecords[0]
  const district = currentRecord.district_name || "Unknown"

  console.log(`[v0] Transforming data for ${district}, current month: ${currentRecord.month}`)

  // Get last 6 months of data
  const historicalData = sortedRecords.slice(0, 6).map((record) => ({
    month: record.month,
    personDays: Math.round(record.Persondays_of_Central_Liability_so_far || 0),
    families: Math.round(record.Total_Households_Worked || 0),
    villages: Math.round(record.Total_No_of_Active_Workers / 100 || 0), // Approximate villages from workers
  }))

  const transformed: TransformedData = {
    district,
    currentMonth: {
      personDays: Math.round(currentRecord.Persondays_of_Central_Liability_so_far || 0),
      villages: Math.round(currentRecord.Total_No_of_Active_Workers / 100 || 0),
      families: Math.round(currentRecord.Total_Households_Worked || 0),
      activeWorkers: Math.round(currentRecord.Total_No_of_Active_Workers || 0),
      completedWorks: Math.round(currentRecord.Number_of_Completed_Works || 0),
      ongoingWorks: Math.round(currentRecord.Number_of_Ongoing_Works || 0),
      womenPersonDays: Math.round(currentRecord.Women_Persondays || 0),
      avgDaysPerHousehold: Math.round(currentRecord.Average_days_of_employment_provided_per_Household || 0),
    },
    historicalData: historicalData.reverse(), // Reverse to show oldest first
    lastUpdated: new Date().toISOString(),
  }

  return transformed
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const district = searchParams.get("district")

    if (!district) {
      return NextResponse.json({ error: "District parameter is required" }, { status: 400 })
    }

    console.log(`[v0] Fetching data for district: ${district}`)

    // Fetch data from data.gov.in
    const records = await fetchFromDataGov(district)

    // Transform the data
    const transformedData = transformData(records)

    if (!transformedData) {
      return NextResponse.json({ error: `No data found for district: ${district}` }, { status: 404 })
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Failed to fetch data from data.gov.in" }, { status: 500 })
  }
}
