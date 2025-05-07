-- Create flights table
CREATE TABLE flights (
  id TEXT PRIMARY KEY,
  airline TEXT NOT NULL,
  from_code TEXT NOT NULL,
  to_code TEXT NOT NULL,
  departure TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  current_price INTEGER NOT NULL,
  stops INTEGER NOT NULL DEFAULT 0,
  booking_attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  flight_id TEXT NOT NULL REFERENCES flights(id),
  from_code TEXT NOT NULL,
  to_code TEXT NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  passengers JSONB NOT NULL,
  travel_class TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet table
CREATE TABLE wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  balance INTEGER NOT NULL DEFAULT 50000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update flight prices
CREATE OR REPLACE FUNCTION update_flight_price()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is the third booking attempt within 5 minutes, increase price by 10%
  IF NEW.booking_attempts >= 3 AND 
     NEW.last_attempt_time IS NOT NULL AND 
     (EXTRACT(EPOCH FROM (NOW() - NEW.last_attempt_time)) / 60) <= 5 AND
     NEW.current_price = NEW.base_price THEN
    
    NEW.current_price := NEW.base_price * 1.1;
  
  -- If it's been more than 10 minutes since the last attempt, reset price
  ELSIF NEW.last_attempt_time IS NOT NULL AND 
        (EXTRACT(EPOCH FROM (NOW() - NEW.last_attempt_time)) / 60) > 10 THEN
    
    NEW.current_price := NEW.base_price;
    NEW.booking_attempts := 1;
  
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for flight price updates
CREATE TRIGGER flight_price_update
BEFORE UPDATE ON flights
FOR EACH ROW
EXECUTE FUNCTION update_flight_price();
