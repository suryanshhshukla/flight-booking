"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { Plane, Calendar, Users, Download, ArrowRight } from "lucide-react"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for airports
const airports = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi" },
  { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi" },
  { code: "PNQ", name: "Pune Airport", city: "Pune" },
]

// Mock bookings data
const mockBookings = [
  {
    id: "BK-12345",
    flight_id: "FL-5678",
    from_code: "DEL",
    to_code: "BOM",
    departure_date: new Date().toISOString(),
    travel_class: "Economy",
    total_amount: 2500,
    booking_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: "confirmed",
    passengers: [
      {
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
      },
    ],
  },
  {
    id: "BK-67890",
    flight_id: "FL-1234",
    from_code: "BLR",
    to_code: "HYD",
    departure_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    travel_class: "Business",
    total_amount: 5500,
    booking_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "confirmed",
    passengers: [
      {
        title: "Ms",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "9876543211",
      },
      {
        title: "Mr",
        firstName: "Robert",
        lastName: "Smith",
        email: "robert.smith@example.com",
        phone: "9876543212",
      },
    ],
  },
  {
    id: "BK-24680",
    flight_id: "FL-9876",
    from_code: "COK",
    to_code: "DEL",
    departure_date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    travel_class: "Economy",
    total_amount: 3200,
    booking_date: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    status: "completed",
    passengers: [
      {
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
      },
    ],
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('bookings')
        //   .select('*')
        //   .order('booking_date', { ascending: false })

        // if (error) throw error
        // setBookings(data || [])

        // For demo purposes, use mock data
        setBookings(mockBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.departure_date) > new Date() && booking.status === "confirmed",
  )

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.departure_date) <= new Date() || booking.status === "completed",
  )

  const handleViewBooking = (bookingId: string) => {
    router.push(`/flights/confirmation?bookingId=${bookingId}`)
  }

  const handleDownloadTicket = (bookingId: string) => {
    // In a real app, this would generate a PDF ticket
    alert(`Downloading ticket for booking ${bookingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Plane className="h-12 w-12 mx-auto animate-bounce" />
            <h2 className="mt-4 text-xl font-semibold">Loading your bookings...</h2>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage all your flight bookings</p>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No upcoming bookings</h3>
                    <p className="text-muted-foreground mt-2">
                      You don't have any upcoming flights. Book a flight to get started!
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Book a Flight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const fromAirport = airports.find((airport) => airport.code === booking.from_code)
                  const toAirport = airports.find((airport) => airport.code === booking.to_code)
                  const departureDate = new Date(booking.departure_date)

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {booking.travel_class}
                              </Badge>
                              <h3 className="text-lg font-semibold">
                                {fromAirport?.city} to {toAirport?.city}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Flight {booking.flight_id} • {format(departureDate, "EEEE, MMMM d, yyyy")}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                              <div className="text-sm text-muted-foreground">Booking ID</div>
                              <div className="font-medium">{booking.id}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">Date</div>
                                <div className="font-medium">{format(departureDate, "MMM d, yyyy")}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">Passengers</div>
                                <div className="font-medium">{booking.passengers.length}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">₹</div>
                              <div>
                                <div className="text-sm text-muted-foreground">Total Amount</div>
                                <div className="font-medium">₹{booking.total_amount.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/40 p-4 flex flex-col sm:flex-row gap-3 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDownloadTicket(booking.id)}
                          >
                            <Download className="h-4 w-4" />
                            Download Ticket
                          </Button>
                          <Button size="sm" className="gap-2" onClick={() => handleViewBooking(booking.id)}>
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No past bookings</h3>
                    <p className="text-muted-foreground mt-2">
                      You don't have any past flights. Book a flight to get started!
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Book a Flight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const fromAirport = airports.find((airport) => airport.code === booking.from_code)
                  const toAirport = airports.find((airport) => airport.code === booking.to_code)
                  const departureDate = new Date(booking.departure_date)

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {booking.travel_class}
                              </Badge>
                              <h3 className="text-lg font-semibold">
                                {fromAirport?.city} to {toAirport?.city}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Flight {booking.flight_id} • {format(departureDate, "EEEE, MMMM d, yyyy")}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                              <div className="text-sm text-muted-foreground">Booking ID</div>
                              <div className="font-medium">{booking.id}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">Date</div>
                                <div className="font-medium">{format(departureDate, "MMM d, yyyy")}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">Passengers</div>
                                <div className="font-medium">{booking.passengers.length}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">₹</div>
                              <div>
                                <div className="text-sm text-muted-foreground">Total Amount</div>
                                <div className="font-medium">₹{booking.total_amount.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/40 p-4 flex flex-col sm:flex-row gap-3 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDownloadTicket(booking.id)}
                          >
                            <Download className="h-4 w-4" />
                            Download Ticket
                          </Button>
                          <Button size="sm" className="gap-2" onClick={() => handleViewBooking(booking.id)}>
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
