import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { supabaseClient } from "./service/supabase.ts";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

async function testSupabaseConnection() {
  const {data, error} = await supabaseClient.from("items").select("*");

  if (error) {
    console.error("Error connecting to Supabase:", error);
  } else {
    console.log("Supabase connection successful. Data:", data);
  }
}

testSupabaseConnection();