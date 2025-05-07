"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@supabase/supabase-js"
import { Check, Download, Plane, Calendar } from "lucide-react"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  { code: "LEH", name: "Kushok Bakula Rimpochee Airport", city: "Leh" }
]

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingId = searchParams.get("bookingId") || ""
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // If bookingId starts with TEMP-, it's a temporary booking (for demo purposes)
        if (bookingId.startsWith("TEMP-")) {
          // Create a mock booking
          setBooking({
            id: bookingId,
            flight_id: "FL-" + Math.floor(Math.random() * 10000),
            from_code: "DEL",
            to_code: "BOM",
            departure_date: new Date().toISOString(),
            travel_class: "Economy",
            total_amount: 2500 * Math.floor(Math.random() * 3 + 1),
            booking_date: new Date().toISOString(),
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
          })
        } else {
          // Fetch from Supabase
          const { data, error } = await supabase.from("bookings").select("*").eq("id", bookingId).single()

          if (error) throw error
          setBooking(data)
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    alert("Ticket download functionality would be implemented here")
  }

  const handleViewBookings = () => {
    router.push("/bookings")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Plane className="h-12 w-12 mx-auto animate-bounce" />
            <h2 className="mt-4 text-xl font-semibold">Loading booking details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Booking Not Found</CardTitle>
              <CardDescription>We couldn't find the booking you're looking for.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")} className="w-full">
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const fromAirport = airports.find((airport) => airport.code === booking.from_code)
  const toAirport = airports.find((airport) => airport.code === booking.to_code)
  const departureDate = new Date(booking.departure_date)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2">Your booking has been confirmed and your tickets are ready.</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Booking ID: {booking.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 mb-2 md:mb-0">
                    <Plane className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Flight</div>
                      <div className="text-sm text-muted-foreground">{booking.flight_id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">{format(departureDate, "EEEE, MMMM d, yyyy")}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="text-xl font-bold">{fromAirport?.code}</div>
                    <div className="text-sm">{fromAirport?.city}</div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-full h-[2px] bg-gray-200">
                      <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">To</div>
                    <div className="text-xl font-bold">{toAirport?.code}</div>
                    <div className="text-sm">{toAirport?.city}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Class</div>
                    <div className="font-medium">{booking.travel_class}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Passengers</div>
                    <div className="font-medium">{booking.passengers.length}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-medium">₹{booking.total_amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button className="w-full sm:w-auto gap-2" onClick={handleDownloadTicket}>
                <Download className="h-4 w-4" />
                Download Ticket
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleViewBookings}>
                View All Bookings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengers.map((passenger: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="font-medium">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {passenger.email} • {passenger.phone}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
