"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for airport suggestions
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
  { code: "LEH", name: "Kushok Bakula Rimpochee Airport", city: "Leh" }
]

export function SearchForm() {
  const router = useRouter()
  const isMobile = useMobile()
  const [date, setDate] = useState<Date>()
  const [fromQuery, setFromQuery] = useState("")
  const [toQuery, setToQuery] = useState("")
  const [fromSuggestions, setFromSuggestions] = useState<typeof airports>([])
  const [toSuggestions, setToSuggestions] = useState<typeof airports>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [selectedFrom, setSelectedFrom] = useState<(typeof airports)[0] | null>(null)
  const [selectedTo, setSelectedTo] = useState<(typeof airports)[0] | null>(null)
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("Economy")

  const handleFromSearch = (query: string) => {
    setFromQuery(query)
    if (query.length > 1) {
      const filtered = airports.filter(
        (airport) =>
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase()),
      )
      setFromSuggestions(filtered)
      setShowFromSuggestions(true)
    } else {
      setShowFromSuggestions(false)
    }
  }

  const handleToSearch = (query: string) => {
    setToQuery(query)
    if (query.length > 1) {
      const filtered = airports.filter(
        (airport) =>
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase()),
      )
      setToSuggestions(filtered)
      setShowToSuggestions(true)
    } else {
      setShowToSuggestions(false)
    }
  }

  const handleFromSelect = (airport: (typeof airports)[0]) => {
    setSelectedFrom(airport)
    setFromQuery(`${airport.city} (${airport.code})`)
    setShowFromSuggestions(false)
  }

  const handleToSelect = (airport: (typeof airports)[0]) => {
    setSelectedTo(airport)
    setToQuery(`${airport.city} (${airport.code})`)
    setShowToSuggestions(false)
  }

  const handleSearch = () => {
    if (!selectedFrom || !selectedTo || !date) {
      alert("Please fill in all required fields")
      return
    }

    // Construct search params
    const searchParams = new URLSearchParams({
      from: selectedFrom.code,
      to: selectedTo.code,
      date: date.toISOString(),
      passengers,
      class: travelClass,
    })

    router.push(`/flights/search?${searchParams.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-xl shadow-lg p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Label htmlFor="from">From</Label>
          <div className="relative">
            <Input
              id="from"
              placeholder="City or Airport"
              value={fromQuery}
              onChange={(e) => handleFromSearch(e.target.value)}
              onFocus={() => fromQuery.length > 1 && setShowFromSuggestions(true)}
              className="w-full"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {fromSuggestions.map((airport) => (
                  <div
                    key={airport.code}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleFromSelect(airport)}
                  >
                    <div className="font-medium">
                      {airport.city} ({airport.code})
                    </div>
                    <div className="text-xs text-muted-foreground">{airport.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="to">To</Label>
          <div className="relative">
            <Input
              id="to"
              placeholder="City or Airport"
              value={toQuery}
              onChange={(e) => handleToSearch(e.target.value)}
              onFocus={() => toQuery.length > 1 && setShowToSuggestions(true)}
              className="w-full"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {toSuggestions.map((airport) => (
                  <div
                    key={airport.code}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleToSelect(airport)}
                  >
                    <div className="font-medium">
                      {airport.city} ({airport.code})
                    </div>
                    <div className="text-xs text-muted-foreground">{airport.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="date">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="passengers">Passengers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger id="passengers">
                <SelectValue placeholder="Passengers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="class">Class</Label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="First">First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button className="w-full mt-6 gap-2" size="lg" onClick={handleSearch}>
        <Plane className="h-4 w-4" />
        Search Flights
      </Button>
    </div>
  )
}
