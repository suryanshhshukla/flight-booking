"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format, addMinutes } from "date-fns"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Luggage, Coffee, Wifi, AlertCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useTheme } from "next-themes"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for airlines
const airlines = [
  { id: "indigo", name: "IndiGo", logo: "indigo.png" },
  { id: "airIndia", name: "Air India", logo: "airindia.png" },
  { id: "spiceJet", name: "SpiceJet", logo: "spicejet.png" },
  { id: "vistara", name: "Vistara", logo: "vistara.png" },
  { id: "goAir", name: "Go Air", logo: "goair.png" },
]

// Mock data for airports
const airports = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi" },
  { code: "PNQ", name: "Pune Airport", city: "Pune" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad" },
  { code: "GOI", name: "Goa International Airport (Dabolim)", city: "Goa" },
  { code: "IXC", name: "Shaheed Bhagat Singh International Airport", city: "Chandigarh" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur" },
  { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow" },
  { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar" },
  { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi" },
  { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna" },
  { code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar" },
  { code: "DIB", name: "Dibrugarh Airport", city: "Dibrugarh" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati" },
  { code: "IXB", name: "Bagdogra Airport", city: "Siliguri" },
  { code: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi" },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur" },
  { code: "IXM", name: "Madurai Airport", city: "Madurai" },
  { code: "TIR", name: "Tirupati Airport", city: "Tirupati" },
  { code: "IXE", name: "Mangalore International Airport", city: "Mangalore" },
  { code: "RAJ", name: "Rajkot Airport", city: "Rajkot" },
  { code: "BDQ", name: "Vadodara Airport", city: "Vadodara" },
  { code: "JLR", name: "Jabalpur Airport", city: "Jabalpur" },
  { code: "STV", name: "Surat Airport", city: "Surat" },
  { code: "BHO", name: "Raja Bhoj Airport", city: "Bhopal" },
  { code: "DHM", name: "Gaggal Airport", city: "Dharamshala" },
  { code: "IXZ", name: "Veer Savarkar International Airport", city: "Port Blair" },
  { code: "LEH", name: "Kushok Bakula Rimpochee Airport", city: "Leh" },
]

// Generate a random flight duration between 1.5 and 4 hours
const getRandomDuration = () => {
  const minMinutes = 90
  const maxMinutes = 240
  return Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes
}

// Generate a random price between 2000 and 3000
const getRandomPrice = () => {
  return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000
}

// Generate random flight times based on the date
const getRandomFlightTimes = (date: Date) => {
  const departureHour = Math.floor(Math.random() * 18) + 5 // 5 AM to 11 PM
  const departureMinute = Math.floor(Math.random() * 12) * 5 // 0, 5, 10, ..., 55

  const departureTime = new Date(date)
  departureTime.setHours(departureHour, departureMinute, 0, 0)

  const durationMinutes = getRandomDuration()
  const arrivalTime = addMinutes(departureTime, durationMinutes)

  return {
    departure: departureTime,
    arrival: arrivalTime,
    duration: durationMinutes,
  }
}

// Format duration in hours and minutes
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Generate mock flights
const generateFlights = (fromCode: string, toCode: string, date: Date, count = 10) => {
  const flights = []

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const times = getRandomFlightTimes(date)
    const price = getRandomPrice()

    flights.push({
      id: `FL-${Math.floor(Math.random() * 10000)}`,
      airline: airline.name,
      airlineId: airline.id,
      from: fromCode,
      to: toCode,
      departure: times.departure,
      arrival: times.arrival,
      duration: times.duration,
      price: price,
      basePrice: price, // Store the original price for dynamic pricing
      stops: Math.random() > 0.7 ? 1 : 0,
      bookingAttempts: 0,
      lastAttemptTime: null,
    })
  }

  // Sort by departure time
  return flights.sort((a, b) => a.departure.getTime() - b.departure.getTime())
}

interface Flight {
  id: string
  airline: string
  airlineId: string
  from: string
  to: string
  departure: Date
  arrival: Date
  duration: number
  price: number
  basePrice: number
  stops: number
  bookingAttempts: number
  lastAttemptTime: Date | null
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme, setTheme } = useTheme() // Add this line to initialize theme hook

  const fromCode = searchParams.get("from") || ""
  const toCode = searchParams.get("to") || ""
  const dateParam = searchParams.get("date") || ""
  const passengers = searchParams.get("passengers") || "1"
  const travelClass = searchParams.get("class") || "Economy"

  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([2000, 3000])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [departureTime, setDepartureTime] = useState<string>("any")
  const [sortBy, setSortBy] = useState<string>("price")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fromAirport = airports.find((airport) => airport.code === fromCode)
  const toAirport = airports.find((airport) => airport.code === toCode)
  const date = dateParam ? new Date(dateParam) : new Date()

  useEffect(() => {
    // Check if we have valid search parameters
    if (!fromCode || !toCode || !dateParam) {
      router.push("/")
      return
    }

    // Generate mock flights
    const generatedFlights = generateFlights(fromCode, toCode, date)
    setFlights(generatedFlights)
    setFilteredFlights(generatedFlights)
    setLoading(false)

    // Set initial price range based on available flights
    if (generatedFlights.length > 0) {
      const prices = generatedFlights.map((flight) => flight.price)
      setPriceRange([Math.min(...prices), Math.max(...prices)])
    }
  }, [fromCode, toCode, dateParam, router])

  // Apply filters
  useEffect(() => {
    let result = [...flights]

    // Filter by price
    result = result.filter((flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1])

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      result = result.filter((flight) => selectedAirlines.includes(flight.airlineId))
    }

    // Filter by departure time
    if (departureTime !== "any") {
      const hour = Number.parseInt(departureTime)
      result = result.filter((flight) => {
        const departureHour = flight.departure.getHours()
        if (departureTime === "morning") return departureHour >= 5 && departureHour < 12
        if (departureTime === "afternoon") return departureHour >= 12 && departureHour < 18
        if (departureTime === "evening") return departureHour >= 18 || departureHour < 5
        return true
      })
    }

    // Sort flights
    if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "duration") {
      result.sort((a, b) => a.duration - b.duration)
    } else if (sortBy === "departure") {
      result.sort((a, b) => a.departure.getTime() - b.departure.getTime())
    } else if (sortBy === "arrival") {
      result.sort((a, b) => a.arrival.getTime() - b.arrival.getTime())
    }

    setFilteredFlights(result)
  }, [flights, priceRange, selectedAirlines, departureTime, sortBy])

  const handleAirlineToggle = (airlineId: string) => {
    setSelectedAirlines((prev) => {
      if (prev.includes(airlineId)) {
        return prev.filter((id) => id !== airlineId)
      } else {
        return [...prev, airlineId]
      }
    })
  }

  const handleBookFlight = (flight: Flight) => {
    // Implement dynamic pricing logic
    const now = new Date()
    const updatedFlights = flights.map((f) => {
      if (f.id === flight.id) {
        // Check if this is the third booking attempt within 5 minutes
        let newPrice = f.price
        let attempts = f.bookingAttempts + 1

        if (f.lastAttemptTime) {
          const timeDiff = now.getTime() - f.lastAttemptTime.getTime()
          const minutesDiff = timeDiff / (1000 * 60)

          // Reset attempts if last attempt was more than 10 minutes ago
          if (minutesDiff > 10) {
            attempts = 1
            newPrice = f.basePrice
          }
          // Increase price by 10% if this is the third attempt within 5 minutes
          else if (minutesDiff <= 5 && attempts >= 3 && newPrice === f.basePrice) {
            newPrice = Math.round(f.basePrice * 1.1)
          }
        }

        return {
          ...f,
          price: newPrice,
          bookingAttempts: attempts,
          lastAttemptTime: now,
        }
      }
      return f
    })

    setFlights(updatedFlights)

    // Navigate to booking page
    const bookingParams = new URLSearchParams({
      flightId: flight.id,
      from: fromCode,
      to: toCode,
      date: date.toISOString(),
      passengers,
      class: travelClass,
      price: flight.price.toString(),
    })

    router.push(`/flights/booking?${bookingParams.toString()}`)
  }

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }

    checkUser()

    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Plane className="h-12 w-12 mx-auto animate-bounce" />
            <h2 className="mt-4 text-xl font-semibold">Searching for flights...</h2>
            <p className="mt-2 text-muted-foreground">This won't take long</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Authentication Status Banner */}
        {!loading && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <p className="text-sm">
                {isAuthenticated
                  ? "You're logged in. Your bookings will be saved to your account."
                  : "Sign in to save your flight searches and bookings."}
              </p>
            </div>
            {!isAuthenticated && (
              <Button size="sm" variant="outline" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            )}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Flights from {fromAirport?.city} to {toAirport?.city}
          </h1>
          <p className="text-muted-foreground">
            {format(date, "EEEE, MMMM d, yyyy")} · {passengers}{" "}
            {Number.parseInt(passengers) === 1 ? "passenger" : "passengers"} · {travelClass}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Price Range (₹)</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[2000, 3000]}
                      min={2000}
                      max={3000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Airlines</h3>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={airline.id}
                          checked={selectedAirlines.includes(airline.id)}
                          onChange={() => handleAirlineToggle(airline.id)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={airline.id} className="text-sm">
                          {airline.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Departure Time</h3>
                  <Select value={departureTime} onValueChange={setDepartureTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="morning">Morning (5:00 - 11:59)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12:00 - 17:59)</SelectItem>
                      <SelectItem value="evening">Evening (18:00 - 4:59)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredFlights.length} {filteredFlights.length === 1 ? "flight" : "flights"} found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure Time</SelectItem>
                    <SelectItem value="arrival">Arrival Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredFlights.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No flights found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <Card key={flight.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                        <div className="md:col-span-1 flex flex-col justify-center">
                          <div className="text-lg font-semibold">{flight.airline}</div>
                          <div className="text-sm text-muted-foreground">Flight {flight.id}</div>
                          {flight.stops === 0 ? (
                            <Badge variant="outline" className="mt-2 w-fit">
                              Non-stop
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="mt-2 w-fit">
                              {flight.stops} stop
                            </Badge>
                          )}
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-xl font-bold">{format(flight.departure, "HH:mm")}</div>
                            <div className="text-sm text-muted-foreground">{fromCode}</div>
                          </div>

                          <div className="flex flex-col items-center px-4">
                            <div className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</div>
                            <div className="relative w-24 md:w-32 h-[1px] bg-gray-300 my-2">
                              <div className="absolute top-1/2 left-0 w-2 h-2 -mt-1 rounded-full bg-primary"></div>
                              <div className="absolute top-1/2 right-0 w-2 h-2 -mt-1 rounded-full bg-primary"></div>
                            </div>
                            <div className="flex gap-1">
                              {flight.stops === 0 ? (
                                <span className="text-xs">Direct</span>
                              ) : (
                                <span className="text-xs">{flight.stops} stop</span>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-xl font-bold">{format(flight.arrival, "HH:mm")}</div>
                            <div className="text-sm text-muted-foreground">{toCode}</div>
                          </div>
                        </div>

                        <div className="md:col-span-1 flex flex-col justify-center items-end">
                          <div className="text-2xl font-bold">₹{flight.price}</div>
                          <div className="text-sm text-muted-foreground mb-2">per passenger</div>
                          <Button onClick={() => handleBookFlight(flight)}>Book Now</Button>
                        </div>
                      </div>

                      <div className="bg-muted/40 p-3 flex justify-between items-center">
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Luggage className="h-4 w-4" />
                            <span>15kg baggage</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coffee className="h-4 w-4" />
                            <span>Meals</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wifi className="h-4 w-4" />
                            <span>Wi-Fi</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
