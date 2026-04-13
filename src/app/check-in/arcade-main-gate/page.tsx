import { redirect } from "next/navigation";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { CheckInClient } from "./CheckInClient";

export default async function ArcadeMainGateCheckinPage() {
  const user = await getCurrentUserSummary();

  if (!user) {
    redirect("/login?next=/check-in/arcade-main-gate");
  }

  return <CheckInClient venueSlug="arcade-main-gate" venueName="Arcade Community Hall" userName={user.name} />;
}
