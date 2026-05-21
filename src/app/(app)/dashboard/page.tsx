import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Wind, Plane } from "lucide-react";
import { getAllTrips } from "@/lib/api/trips";
import { getCurrentUser } from "@/lib/api/user";

export default function DashboardPage() {
  const trips = getAllTrips();
  const user = getCurrentUser();
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const allActivity = trips.flatMap((t) => t.recentActivity);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-1"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          {upcoming[0] && (
            <p className="text-sm text-[#45464d]">
              Your next adventure to{" "}
              <span className="font-semibold text-[#000]">{upcoming[0].title}</span>{" "}
              begins in {upcoming[0].daysLeft} days.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {trips[0].collaborators.slice(0, 3).map((c, i) => (
            <div
              key={c.id}
              className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-[#e0e3e5]"
              style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: 3 - i }}
            >
              {c.avatar && (
                <Image src={c.avatar} alt={c.name} width={32} height={32} className="object-cover w-full h-full" />
              )}
            </div>
          ))}
          <Link href="/planner" className="text-xs text-[#00668a] font-semibold ml-2 hover:underline">
            Share Trip
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
              Upcoming Trips
            </h2>
            <Link href="#" className="text-xs text-[#00668a] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/planner/${trip.id}`}
                className="group bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden hover:border-[#c6c6cd] hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={trip.coverImage}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00668a]/90 text-white text-[10px] font-semibold mb-1">
                      {trip.daysLeft} Days Left
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#191c1e] mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                    {trip.title}
                  </h3>
                  <p className="text-xs text-[#76777d] mb-3">
                    {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#45464d]">Planning Progress</span>
                    <span className="text-xs font-semibold text-[#000]">{trip.planningProgress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-[#f2f4f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00668a] rounded-full transition-all"
                      style={{ width: `${trip.planningProgress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
            Analytics
          </h2>
          {[
            { label: "Total Spent", value: `$${trips[0].totalBudget.toLocaleString()}`, icon: TrendingUp, color: "#00668a" },
            { label: "Miles Flown", value: `${(user.stats.milesFlown / 1000).toFixed(1)}k`, icon: Plane, color: "#00668a" },
            { label: "Carbon Footprint", value: `${trips[0].carbonFootprint} tCO₂`, icon: Wind, color: "#10b981" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e0e3e5] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#76777d] mb-1">{label}</p>
                <p className="text-xl font-bold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
                  {value}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
              Budget Overview
            </h2>
            <button className="text-[#76777d] hover:text-[#000] transition-colors">
              <span className="text-lg font-light">···</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f2f4f6" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#00668a" strokeWidth="3"
                  strokeDasharray={`${trips[0].planningProgress} ${100 - trips[0].planningProgress}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#191c1e]">70%</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {Object.entries(trips[0].budgetBreakdown).filter(([, v]) => v > 0).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#00668a]" />
                    <span className="capitalize text-[#45464d]">{key}</span>
                  </div>
                  <span className="font-semibold text-[#191c1e]">${val.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5 md:p-6">
          <h2 className="text-base font-semibold text-[#191c1e] mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Recent Activity
          </h2>
          <div className="flex flex-col gap-4">
            {allActivity.slice(0, 3).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#f2f4f6] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs">
                    {act.type === "edit" ? "✏️" : act.type === "booking" ? "✅" : "👤"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#191c1e] leading-relaxed">{act.text}</p>
                  <p className="text-[10px] text-[#76777d] mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
