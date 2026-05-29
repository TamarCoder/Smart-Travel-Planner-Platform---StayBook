import Image from "next/image";
import Link from "next/link";
import { UserPlus, DollarSign, PlaneTakeoff, Leaf, Pencil, Ticket, Users, MoreHorizontal } from "lucide-react";
import { getCurrentUser } from "@/lib/api/user";
import { getAllTrips, getUpcomingTrips } from "@/lib/api/trips";

function getActivityIcon(type: string) {
  if (type === "booking") return Ticket;
  if (type === "join") return Users;
  return Pencil;
}

export default function DashboardMain() {
  const user = getCurrentUser();
  const upcomingTrips = getUpcomingTrips();
  const allTrips = getAllTrips();
  const nextTrip = upcomingTrips[0];

  const totalSpent = allTrips.reduce((sum, t) => sum + t.spent, 0);
  const totalMiles = allTrips.reduce((sum, t) => sum + t.milesMowed, 0);
  const totalCarbon = allTrips.reduce((sum, t) => sum + t.carbonFootprint, 0);

  const budgetPct = nextTrip
    ? Math.round((nextTrip.spent / nextTrip.totalBudget) * 100)
    : 0;

  const analytics = [
    {
      label: "Total Spent",
      value: "$" + totalSpent.toLocaleString(),
      icon: DollarSign,
      delay: "0s",
    },
    {
      label: "Miles Flown",
      value: (totalMiles / 1000).toFixed(1) + "k",
      icon: PlaneTakeoff,
      delay: "0.1s",
    },
    {
      label: "Carbon Footprint",
      value: totalCarbon.toFixed(1) + " tCO2",
      icon: Leaf,
      delay: "0.2s",
    },
  ];

  const budgetBreakdown = nextTrip
    ? [
        { label: "Flights", amount: nextTrip.budgetBreakdown.flights, color: "bg-sky-600" },
        { label: "Hotels", amount: nextTrip.budgetBreakdown.hotels, color: "bg-sky-600/50" },
        { label: "Dining", amount: nextTrip.budgetBreakdown.dining, color: "bg-sky-600/20" },
      ]
    : [];

  return (
    <main className="lg:ml-64 pt-24 pb-16 min-h-screen bg-background px-4 md:px-12">
      <div className="max-w-7xl mx-auto">

        <div
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ animation: "fadeInUp 0.4s ease both" }}
        >
          <div>
            <h1
              className="font-semibold text-[2rem] leading-10 text-navy-950 mb-1"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-base text-text-secondary">
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div
            className="md:col-span-8 flex flex-col gap-6"
            style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-2xl font-semibold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Upcoming Trips
              </h2>
              <a href="#" className="text-sm font-medium text-sky-600 hover:underline">
                View all
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                  <div className="relative h-48">
                    <Image
                      src={trip.coverImage}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-navy-950">
                      {trip.daysLeft} Days Left
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="font-semibold text-navy-950 mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {trip.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4">
                      {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                      {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="w-full bg-surface-hover h-1.5 rounded-full mb-1 overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full"
                        style={{
                          width: trip.planningProgress + "%",
                          animation: "progressGrow 1s ease-out both",
                          animationDelay: "0.5s",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                      <span>Planning Progress</span>
                      <span>{trip.planningProgress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="md:col-span-4 flex flex-col gap-6"
            style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}
          >
            <h2
              className="text-2xl font-semibold text-navy-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Analytics
            </h2>
            <div className="flex flex-col gap-4">
              {analytics.map(({ label, value, icon: Icon, delay }) => (
                <div
                  key={label}
                  className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  style={{ animation: `fadeInUp 0.4s ease ${delay} both` }}
                >
                  <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                    <h4 className="text-2xl font-bold text-navy-950">{value}</h4>
                  </div>
                  <div className="w-12 h-12 bg-sky-600/10 rounded-xl flex items-center justify-center text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="md:col-span-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animation: "fadeInUp 0.4s ease 0.3s both" }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-2xl font-semibold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Budget Overview
              </h2>
              <button className="text-text-secondary hover:text-sky-600 transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-surface-hover"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray="364.4"
                    strokeDashoffset="365"
                    className="text-sky-600"
                    style={{ animation: "donutDraw 1.2s ease-out 0.9s both" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-navy-950">{budgetPct}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {budgetBreakdown.map(({ label, amount, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-sm text-text-secondary">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-navy-950">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="md:col-span-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col gap-6"
            style={{ animation: "fadeInUp 0.4s ease 0.4s both" }}
          >
            <h2
              className="text-2xl font-semibold text-navy-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Activity
            </h2>
            <div className="flex flex-col">
              {nextTrip?.recentActivity.map((item, idx) => {
                const Icon = getActivityIcon(item.type);
                const isLast = idx === (nextTrip.recentActivity.length - 1);
                return (
                  <div key={item.id} className="flex gap-4 cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-sky-600/10 flex items-center justify-center text-sky-600 z-10 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-border-strong/30 mt-1 min-h-4" />
                      )}
                    </div>
                    <div className={isLast ? "pb-0" : "pb-5"}>
                      <p className="text-sm font-medium text-navy-950">{item.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{item.subtitle}</p>
                      <p className="text-[10px] text-text-muted mt-1">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
