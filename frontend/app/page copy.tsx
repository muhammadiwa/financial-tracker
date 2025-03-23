import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard if authenticated, otherwise to login
  // For now, we'll just redirect to login
  redirect("/login")
}

