"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import { Wallet, PlusCircle, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock transaction data
const mockTransactions = [
  {
    id: "tx-12345",
    type: "credit",
    amount: 10000,
    description: "Added money to wallet",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: "tx-67890",
    type: "debit",
    amount: 2500,
    description: "Flight booking: DEL to BOM",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    id: "tx-24680",
    type: "credit",
    amount: 5000,
    description: "Added money to wallet",
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: "tx-13579",
    type: "debit",
    amount: 5500,
    description: "Flight booking: BLR to HYD",
    date: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
  },
]

export default function WalletPage() {
  const [walletBalance, setWalletBalance] = useState(50000) // Default wallet balance
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addAmount, setAddAmount] = useState("")

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // const { data: walletData, error: walletError } = await supabase
        //   .from('wallet')
        //   .select('balance')
        //   .single()

        // if (walletError) throw walletError
        // setWalletBalance(walletData?.balance || 50000)

        // const { data: txData, error: txError } = await supabase
        //   .from('transactions')
        //   .select('*')
        //   .order('date', { ascending: false })

        // if (txError) throw txError
        // setTransactions(txData || [])

        // For demo purposes, use mock data and local storage
        const storedBalance = localStorage.getItem("walletBalance")
        if (storedBalance) {
          setWalletBalance(Number.parseInt(storedBalance))
        }

        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  const handleAddMoney = () => {
    const amount = Number.parseInt(addAmount)

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to add",
        variant: "destructive",
      })
      return
    }

    // Update wallet balance
    const newBalance = walletBalance + amount
    setWalletBalance(newBalance)

    // Add transaction record
    const newTransaction = {
      id: "tx-" + Math.floor(Math.random() * 100000),
      type: "credit",
      amount: amount,
      description: "Added money to wallet",
      date: new Date().toISOString(),
    }

    setTransactions([newTransaction, ...transactions])

    // Store updated balance in local storage
    localStorage.setItem("walletBalance", newBalance.toString())

    // Show success message
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to your wallet`,
      variant: "default",
    })

    // Reset input
    setAddAmount("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto animate-pulse" />
            <h2 className="mt-4 text-xl font-semibold">Loading wallet data...</h2>
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
          <h1 className="text-2xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and view transaction history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>Your current wallet balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">₹{walletBalance.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-2">Available Balance</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="grid gap-2 w-full">
                  <Label htmlFor="amount">Add Money</Label>
                  <div className="flex gap-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                    />
                    <Button onClick={handleAddMoney}>Add</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" className="w-full">
                    ₹1,000
                  </Button>
                  <Button variant="outline" className="w-full">
                    ₹2,000
                  </Button>
                  <Button variant="outline" className="w-full">
                    ₹5,000
                  </Button>
                  <Button variant="outline" className="w-full">
                    ₹10,000
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">HDFC Bank</div>
                        <div className="text-sm text-muted-foreground">**** 1234</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">ICICI Bank</div>
                        <div className="text-sm text-muted-foreground">**** 5678</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="credit">Added</TabsTrigger>
                    <TabsTrigger value="debit">Spent</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <div className="space-y-4">
                      {transactions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No transactions found</p>
                        </div>
                      ) : (
                        transactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-md">
                            <div className="flex items-center gap-3">
                              {transaction.type === "credit" ? (
                                <div className="p-2 bg-green-100 rounded-full">
                                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="p-2 bg-red-100 rounded-full">
                                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="text-sm text-muted-foreground">{formatDate(transaction.date)}</div>
                              </div>
                            </div>
                            <div
                              className={
                                transaction.type === "credit"
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="credit">
                    <div className="space-y-4">
                      {transactions.filter((t) => t.type === "credit").length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No money added yet</p>
                        </div>
                      ) : (
                        transactions
                          .filter((t) => t.type === "credit")
                          .map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-4 border rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-sm text-muted-foreground">{formatDate(transaction.date)}</div>
                                </div>
                              </div>
                              <div className="text-green-600 font-medium">+₹{transaction.amount.toLocaleString()}</div>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="debit">
                    <div className="space-y-4">
                      {transactions.filter((t) => t.type === "debit").length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No money spent yet</p>
                        </div>
                      ) : (
                        transactions
                          .filter((t) => t.type === "debit")
                          .map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-4 border rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full">
                                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-sm text-muted-foreground">{formatDate(transaction.date)}</div>
                                </div>
                              </div>
                              <div className="text-red-600 font-medium">-₹{transaction.amount.toLocaleString()}</div>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
