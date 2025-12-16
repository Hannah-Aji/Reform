
// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sghjnrxawansuwzdeymq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnaGpucnhhd2Fuc3V3emRleW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzA2NDEsImV4cCI6MjA3NjU0NjY0MX0.M4YOOgbcVoEiTJBC7-Sr_0HbI3CYpUgyoScUgpMOWLY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
