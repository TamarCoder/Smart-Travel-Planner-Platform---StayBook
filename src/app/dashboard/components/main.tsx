import Image from "next/image";
import { UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/api/user";
import { getUpcomingTrips } from "@/lib/api/trips";

export default function DashboardMain() {
  const user = getCurrentUser();
  const upcomingTrips = getUpcomingTrips();
  const nextTrip = upcomingTrips[0];

  return (
    <main className="lg:ml-64 pt-16 min-h-screen bg-background px-4 md:px-12 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1
              className="text-3xl font-bold text-navy-950 mb-1"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-text-secondary text-sm">
              Your next adventure to {nextTrip?.title} begins in {nextTrip?.daysLeft} days.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <Image
                src="/assets/travel_dashboard__img_02.png"
                alt="Collaborator"
                width={40}
                height={40}
                className="rounded-full border-2 border-white object-cover"
              />
              <Image
                src="/assets/travel_dashboard__img_03.png"
                alt="Collaborator"
                width={40}
                height={40}
                className="rounded-full border-2 border-white object-cover"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
                +4
              </div>
            </div>
            <button className="text-sky-600 text-sm font-medium flex items-center gap-1.5 hover:underline">
              <UserPlus className="h-4 w-4" />
              Share Trip
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
