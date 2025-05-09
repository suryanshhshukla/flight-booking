"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import { CreditCard, Wallet, AlertCircle } from "lucide-react"

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
  { code: "LEH", name: "Kushok Bakula Rimpochee Airport", city: "Leh" },
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const flightId = searchParams.get("flightId") || ""
  const fromCode = searchParams.get("from") || ""
  const toCode = searchParams.get("to") || ""
  const dateParam = searchParams.get("date") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const travelClass = searchParams.get("class") || "Economy"
  const price = Number.parseInt(searchParams.get("price") || "0")

  const [loading, setLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState(50000) // Default wallet balance
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [passengerDetails, setPassengerDetails] = useState(
    Array(passengers).fill({
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
    }),
  )

  const fromAirport = airports.find((airport) => airport.code === fromCode)
  const toAirport = airports.find((airport) => airport.code === toCode)
  const date = dateParam ? new Date(dateParam) : new Date()

  const totalAmount = price * passengers

  const updatePassengerDetail = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengerDetails]
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    }
    setPassengerDetails(updatedPassengers)
  }

  const handleBooking = async () => {
    // Validate passenger details
    const isValid = passengerDetails.every((p) => p.title && p.firstName && p.lastName && p.email && p.phone)

    if (!isValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all passenger details",
        variant: "destructive",
      })
      return
    }

    // Check if wallet has enough balance
    if (paymentMethod === "wallet" && walletBalance < totalAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Your wallet doesn't have enough balance for this booking",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Generate a unique booking ID
      const bookingId = `BK-${Math.floor(Math.random() * 100000)}`

      // Create booking data
      const bookingData = {
        id: bookingId,
        flight_id: flightId,
        from_code: fromCode,
        to_code: toCode,
        departure_date: date.toISOString(),
        passengers: passengerDetails,
        travel_class: travelClass,
        total_amount: totalAmount,
        booking_date: new Date().toISOString(),
        payment_method: paymentMethod,
        status: "confirmed",
      }

      // Store in localStorage for demo purposes (in addition to Supabase)
      const existingBookings = JSON.parse(localStorage.getItem("myBookings") || "[]")
      localStorage.setItem("myBookings", JSON.stringify([...existingBookings, bookingData]))

      // Try to insert into Supabase if available
      try {
        const { data, error } = await supabase.from("bookings").insert([bookingData]).select()
        if (error) throw error
      } catch (supabaseError) {
        console.warn("Supabase storage failed, using local storage only:", supabaseError)
        // Continue with local storage only
      }

      // Update wallet balance if paid from wallet
      if (paymentMethod === "wallet") {
        const newBalance = walletBalance - totalAmount
        setWalletBalance(newBalance)
        localStorage.setItem("walletBalance", newBalance.toString())

        // Add transaction record
        const transactionData = {
          id: `TX-${Math.floor(Math.random() * 100000)}`,
          type: "debit",
          amount: totalAmount,
          description: `Flight booking: ${fromCode} to ${toCode}`,
          date: new Date().toISOString(),
        }

        const existingTransactions = JSON.parse(localStorage.getItem("walletTransactions") || "[]")
        localStorage.setItem("walletTransactions", JSON.stringify([transactionData, ...existingTransactions]))
      }

      // Show success message
      toast({
        title: "Booking Successful",
        description: `Your booking (ID: ${bookingId}) has been confirmed!`,
        variant: "default",
      })

      // Navigate to confirmation page
      router.push(`/flights/confirmation?bookingId=${bookingId}`)
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load wallet balance from local storage
  useEffect(() => {
    const storedBalance = localStorage.getItem("walletBalance")
    if (storedBalance) {
      setWalletBalance(Number.parseInt(storedBalance))
    }
  }, [])

  // Load existing bookings from localStorage
  useEffect(() => {
    const storedBookings = localStorage.getItem("myBookings")
    if (storedBookings) {
      // This is just to initialize the local storage if needed
      // We don't need to set state here as we're just ensuring the storage exists
      console.log("Found existing bookings in local storage:", JSON.parse(storedBookings).length)
    } else {
      localStorage.setItem("myBookings", JSON.stringify([]))
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            Flight {flightId} from {fromAirport?.city} to {toAirport?.city} on {format(date, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passenger Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
                <CardDescription>
                  Please enter details for all {passengers} {passengers === 1 ? "passenger" : "passengers"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="passenger1">
                  <TabsList className="mb-4">
                    {Array.from({ length: passengers }).map((_, index) => (
                      <TabsTrigger key={index} value={`passenger${index + 1}`}>
                        Passenger {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Array.from({ length: passengers }).map((_, index) => (
                    <TabsContent key={index} value={`passenger${index + 1}`}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor={`title-${index}`}>Title</Label>
                            <Select
                              onValueChange={(value) => updatePassengerDetail(index, "title", value)}
                              value={passengerDetails[index].title}
                            >
                              <SelectTrigger id={`title-${index}`}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mr">Mr</SelectItem>
                                <SelectItem value="Mrs">Mrs</SelectItem>
                                <SelectItem value="Ms">Ms</SelectItem>
                                <SelectItem value="Dr">Dr</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`firstName-${index}`}>First Name</Label>
                            <Input
                              id={`firstName-${index}`}
                              value={passengerDetails[index].firstName}
                              onChange={(e) => updatePassengerDetail(index, "firstName", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                          <Input
                            id={`lastName-${index}`}
                            value={passengerDetails[index].lastName}
                            onChange={(e) => updatePassengerDetail(index, "lastName", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`email-${index}`}>Email</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={passengerDetails[index].email}
                              onChange={(e) => updatePassengerDetail(index, "email", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                            <Input
                              id={`phone-${index}`}
                              value={passengerDetails[index].phone}
                              onChange={(e) => updatePassengerDetail(index, "phone", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                          <Input
                            id={`dob-${index}`}
                            type="date"
                            value={passengerDetails[index].dob}
                            onChange={(e) => updatePassengerDetail(index, "dob", e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay for your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <div>Wallet Balance</div>
                        <div className="text-sm text-muted-foreground">₹{walletBalance.toLocaleString()}</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      <div>Credit/Debit Card</div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "wallet" && walletBalance < totalAmount && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Insufficient wallet balance</p>
                      <p className="text-sm">
                        Your wallet balance is less than the total amount. Please add funds or choose another payment
                        method.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" placeholder="John Doe" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Flight</span>
                  <span>{flightId}</span>
                </div>

                <div className="flex justify-between">
                  <span>From</span>
                  <span>
                    {fromAirport?.city} ({fromCode})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>To</span>
                  <span>
                    {toAirport?.city} ({toCode})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{format(date, "MMM d, yyyy")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Class</span>
                  <span>{travelClass}</span>
                </div>

                <div className="flex justify-between">
                  <span>Passengers</span>
                  <span>{passengers}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Price per passenger</span>
                  <span>₹{price.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Base fare</span>
                  <span>₹{(price * 0.8).toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & fees</span>
                  <span>₹{(price * 0.2).toFixed(0)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="privacy" />
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read the privacy policy
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleBooking} disabled={loading}>
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
