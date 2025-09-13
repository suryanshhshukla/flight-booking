# Flight Booking

A modern flight booking application built with TypeScript and Next.js, designed to help users easily search, book, and manage flights. This project focuses on providing a seamless experience for travelers, especially those performing Umrah, with features supporting airport selection, popular destinations, and wallet management.

## Features

- **Flight Search**: Find available flights by selecting source and destination airports, dates, and travel class.
- **Popular Destinations**: Browse trending flights like Delhi–Mumbai with dynamic pricing and airline details.
- **Booking Management**: Book flights, manage bookings, and view booking details.
- **Wallet System**: Integrated wallet for managing payments and transactions.
- **User Interface**: Responsive design using custom UI components (cards, calendars, carousels, progress bars).
- **Supabase Integration**: Real-time data management for flights, bookings, and wallet transactions.
- **Support for Umrah Travelers**: Special focus on Umrah-related travel needs.

## Technologies Used

- **TypeScript**: Main language for type-safe development.
- **Next.js**: React framework for building the app.
- **Supabase**: Backend for database and authentication.
- **Radix UI**: Accessible UI primitives.
- **Lucide Icons**: Modern icon set.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/suryanshhshukla/flight-booking.git
   cd flight-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project on [Supabase](https://supabase.com).
   - Add your Supabase project URL and anon key to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

- **Flights Table**: Stores flight information (airline, route, schedule, pricing).
- **Bookings Table**: Stores booking details (passengers, payment, status).
- **Wallet Table**: Tracks user wallet transactions.

See `supabase/schema.sql` for schema details.

## Demo

Live site: [flight-booking-ochre.vercel.app](https://flight-booking-ochre.vercel.app)

## License

This project does not currently specify a license.

---

**Contributors:**  
- [@suryanshhshukla](https://github.com/suryanshhshukla) (forked from [@Sagarkrsahu2005](https://github.com/Sagarkrsahu2005/flight-booking))
