
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const env = fs.readFileSync(".env", "utf8");
let supabaseUrl = "";
let supabaseKey = "";
for (const line of env.split("\n")) {
  if (line.startsWith("VITE_SUPABASE_URL=")) supabaseUrl = line.split("=")[1].trim();
  if (line.startsWith("VITE_SUPABASE_ANON_KEY=")) supabaseKey = line.split("=")[1].trim();
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const tx = await supabase.from("transactions").select("*").limit(1);
  console.log("Transactions Columns:", tx.data ? Object.keys(tx.data[0] || {}) : tx.error);
}
test();
