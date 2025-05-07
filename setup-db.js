import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    // Read the schema SQL file
    const schema = fs.readFileSync('./supabase/schema.sql', 'utf8')
    
    // Execute the SQL
    const { error } = await supabase.sql(schema)
    
    if (error) {
      console.error('Error setting up database:', error)
    } else {
      console.log('Database setup completed successfully!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

setupDatabase()