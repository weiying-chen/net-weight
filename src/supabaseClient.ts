import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pratqgdulutgohggfwfo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYXRxZ2R1bHV0Z29oZ2dmd2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0Mjc1NzgsImV4cCI6MjAyNjAwMzU3OH0.miKfZwWualZGbxDZ7KQpvaOK_Rxw6mbQ_EpiPMKi318'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default supabase
