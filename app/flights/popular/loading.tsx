import { Plane } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Plane className="h-12 w-12 mx-auto animate-bounce" />
        <h2 className="mt-4 text-xl font-semibold">Loading popular flights...</h2>
        <p className="mt-2 text-muted-foreground">Finding the best deals for you</p>
      </div>
    </div>
  )
}
