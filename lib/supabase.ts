
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nogdapsjblqmoicarrbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZ2RhcHNqYmxxbW9pY2FycmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MjE0NDMsImV4cCI6MjA4MzA5NzQ0M30.cImrUlIB-laAGia85hiqdEErlS0U8vw9kRXMeHmUwSE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
