import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Redirect to root route
  redirect("/");
}
