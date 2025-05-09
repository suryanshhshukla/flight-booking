"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ArrowRight, TrendingUp, MapPin } from "lucide-react"

// Popular flight destinations
const popularDestinations = [
  {
    from: { code: "DEL", city: "Delhi" },
    to: { code: "BOM", city: "Mumbai" },
    price: 2499,
    airline: "IndiGo",
    departureDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    returnDate: new Date(Date.now() + 86400000 * 14), // 14 days from now
    discount: "15% OFF",
    trending: true,
  },
  {
    from: { code: "BLR", city: "Bangalore" },
    to: { code: "GOI", city: "Goa" },
    price: 1999,
    airline: "SpiceJet",
    departureDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
    returnDate: new Date(Date.now() + 86400000 * 15), // 15 days from now
    discount: "20% OFF",
    trending: true,
  },
  {
    from: { code: "DEL", city: "Delhi" },
    to: { code: "BLR", city: "Bangalore" },
    price: 3299,
    airline: "Air India",
    departureDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    returnDate: new Date(Date.now() + 86400000 * 12), // 12 days from now
    discount: "10% OFF",
    trending: false,
  },
  {
    from: { code: "BOM", city: "Mumbai" },
    to: { code: "CCU", city: "Kolkata" },
    price: 3599,
    airline: "Vistara",
    departureDate: new Date(Date.now() + 86400000 * 8), // 8 days from now
    returnDate: new Date(Date.now() + 86400000 * 15), // 15 days from now
    discount: "12% OFF",
    trending: false,
  },
  {
    from: { code: "HYD", city: "Hyderabad" },
    to: { code: "MAA", city: "Chennai" },
    price: 1799,
    airline: "IndiGo",
    departureDate: new Date(Date.now() + 86400000 * 6), // 6 days from now
    returnDate: new Date(Date.now() + 86400000 * 13), // 13 days from now
    discount: "25% OFF",
    trending: true,
  },
  {
    from: { code: "DEL", city: "Delhi" },
    to: { code: "COK", city: "Kochi" },
    price: 4299,
    airline: "Air India",
    departureDate: new Date(Date.now() + 86400000 * 9), // 9 days from now
    returnDate: new Date(Date.now() + 86400000 * 16), // 16 days from now
    discount: "8% OFF",
    trending: false,
  },
]

// International flight destinations
const internationalDestinations = [
  {
    from: { code: "DEL", city: "Delhi" },
    to: { code: "DXB", city: "Dubai" },
    price: 15999,
    airline: "Emirates",
    departureDate: new Date(Date.now() + 86400000 * 15), // 15 days from now
    returnDate: new Date(Date.now() + 86400000 * 22), // 22 days from now
    discount: "10% OFF",
    trending: true,
  },
  {
    from: { code: "BOM", city: "Mumbai" },
    to: { code: "SIN", city: "Singapore" },
    price: 18499,
    airline: "Singapore Airlines",
    departureDate: new Date(Date.now() + 86400000 * 20), // 20 days from now
    returnDate: new Date(Date.now() + 86400000 * 27), // 27 days from now
    discount: "15% OFF",
    trending: true,
  },
  {
    from: { code: "DEL", city: "Delhi" },
    to: { code: "LHR", city: "London" },
    price: 42999,
    airline: "British Airways",
    departureDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
    returnDate: new Date(Date.now() + 86400000 * 44), // 44 days from now
    discount: "8% OFF",
    trending: false,
  },
  {
    from: { code: "BLR", city: "Bangalore" },
    to: { code: "JFK", city: "New York" },
    price: 58999,
    airline: "Air India",
    departureDate: new Date(Date.now() + 86400000 * 25), // 25 days from now
    returnDate: new Date(Date.now() + 86400000 * 39), // 39 days from now
    discount: "12% OFF",
    trending: true,
  },
]

export default function PopularFlightsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("domestic")

  const handleBookFlight = (flight: any) => {
    // Construct search params for the search page
    const searchParams = new URLSearchParams({
      from: flight.from.code,
      to: flight.to.code,
      date: flight.departureDate.toISOString(),
      passengers: "1",
      class: "Economy",
    })

    router.push(`/flights/search?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Popular Flight Deals</h1>
          <p className="text-muted-foreground">Discover the best flight deals and book your next adventure</p>
        </div>

        <Tabs defaultValue="domestic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="domestic">Domestic Flights</TabsTrigger>
            <TabsTrigger value="international">International Flights</TabsTrigger>
          </TabsList>

          <TabsContent value="domestic">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((flight, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                            <span>{flight.from.code}</span>
                            <ArrowRight className="h-5 w-5" />
                            <span>{flight.to.code}</span>
                          </div>
                          <div className="mt-2 text-sm opacity-90">
                            {flight.from.city} to {flight.to.city}
                          </div>
                        </div>
                      </div>
                      {flight.discount && (
                        <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">{flight.discount}</Badge>
                      )}
                      {flight.trending && (
                        <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-xl font-bold">₹{flight.price}</div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(flight.departureDate, "d MMM")} - {format(flight.returnDate, "d MMM")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {flight.from.city} - {flight.to.city}
                        </span>
                      </div>

                      <Button className="w-full" onClick={() => handleBookFlight(flight)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="international">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internationalDestinations.map((flight, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="h-40 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                            <span>{flight.from.code}</span>
                            <ArrowRight className="h-5 w-5" />
                            <span>{flight.to.code}</span>
                          </div>
                          <div className="mt-2 text-sm opacity-90">
                            {flight.from.city} to {flight.to.city}
                          </div>
                        </div>
                      </div>
                      {flight.discount && (
                        <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">{flight.discount}</Badge>
                      )}
                      {flight.trending && (
                        <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-xl font-bold">₹{flight.price}</div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(flight.departureDate, "d MMM")} - {format(flight.returnDate, "d MMM")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {flight.from.city} - {flight.to.city}
                        </span>
                      </div>

                      <Button className="w-full" onClick={() => handleBookFlight(flight)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
