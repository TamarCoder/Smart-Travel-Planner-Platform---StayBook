import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Plane, Car, Hotel, Plus, Share2, Calendar,
  Route, DollarSign, Cloud, ArrowLeft, MapPin, Clock
} from "lucide-react";
import { getTripById, getAllTrips } from "@/lib/api/trips";

const activityIcons: Record<string, React.ReactNode> = {
  flight: <Plane className="h-3.5 w-3.5" />,
  transfer: <Car className="h-3.5 w-3.5" />,
  hotel: <Hotel className="h-3.5 w-3.5" />,
};

export async function generateStaticParams() {
  return getAllTrips().map((t) => ({ id: t.id }));
}

export default async function PlannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = getTripById(id);
  if (!trip) notFound();

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/dashboard" className="text-[#76777d] hover:text-[#000] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="text-xs text-[#76777d] mb-0.5">Voyager · Trip Planner</div>
            <h1 className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
              {trip.title}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {trip.collaborators.slice(0, 2).map((c) => (
              <div key={c.id} className="h-7 w-7 rounded-full border-2 border-white overflow-hidden bg-[#e0e3e5]">
                {c.avatar && <Image src={c.avatar} alt={c.name} width={28} height={28} className="object-cover" />}
              </div>
            ))}
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#45464d] border border-[#e0e3e5] rounded-xl px-3 py-1.5 hover:border-[#c6c6cd] transition-all">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden mb-6" style={{ height: "200px" }}>
          <Image src={trip.coverImage} alt={trip.title} fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="text-sm font-semibold text-white px-3 py-1 rounded-full bg-[#00668a]/80 backdrop-blur-sm">
              Featured
            </span>
            <h2 className="text-xl font-bold text-white mt-2" style={{ fontFamily: "var(--font-display)" }}>
              {trip.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-base font-semibold text-[#191c1e]" style={{ fontFamily: "var(--font-display)" }}>
            Itinerary
          </h2>
          <div className="flex items-center gap-1 ml-auto">
            <button className="p-1.5 rounded-lg hover:bg-[#f2f4f6] transition-colors" title="Calendar view">
              <Calendar className="h-4 w-4 text-[#45464d]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {trip.itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#f2f4f6] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#45464d] uppercase tracking-wider">
                    Day {day.day}
                  </span>
                  <h3 className="text-sm font-semibold text-[#191c1e] mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                    {day.title}
                  </h3>
                  <p className="text-xs text-[#76777d]">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                {day.activities.length === 0 ? (
                  <p className="text-sm text-[#76777d] italic">No activities yet</p>
                ) : (
                  day.activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-lg bg-[#f2f4f6] flex items-center justify-center shrink-0 mt-0.5 text-[#45464d]">
                        {activityIcons[act.type] ?? <MapPin className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#191c1e]">{act.title}</p>
                          {act.status === "confirmed" && (
                            <span className="text-[10px] font-semibold text-[#10b981] bg-[#d1fae5] px-1.5 py-0.5 rounded-full">
                              Confirmed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#76777d] mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{act.detail}
                        </p>
                      </div>
                      <span className="text-xs text-[#76777d] shrink-0">{act.time}</span>
                    </div>
                  ))
                )}
                <button className="flex items-center gap-2 text-xs font-medium text-[#45464d] hover:text-[#00668a] transition-colors mt-1">
                  <Plus className="h-3.5 w-3.5" /> Add Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Trip Management
          </h3>
          {[
            { icon: Route, label: "Route Optimization" },
            { icon: DollarSign, label: "Budget Breakdown" },
            { icon: Cloud, label: "Weather Forecast" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#45464d] hover:bg-[#f2f4f6] hover:text-[#000] transition-all mb-1"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#00668a]" />
              {label}
            </button>
          ))}
          <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#00668a] text-[#00668a] text-sm font-semibold hover:bg-[#00668a] hover:text-white transition-all">
            <MapPin className="h-4 w-4" /> Expand Map
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#76777d]">UPCOMING STOP</span>
            <span className="text-xs font-semibold text-[#00668a]">41km away</span>
          </div>
          <p className="text-sm font-semibold text-[#191c1e] mb-0.5">Ravello Viewpoint</p>
          <p className="text-xs text-[#76777d]">Recommended for lunch on Day 2</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Live Updates
          </h3>
          {trip.recentActivity.slice(0, 2).map((act) => (
            <div key={act.id} className="flex items-start gap-2 mb-3">
              <div className="h-6 w-6 rounded-full overflow-hidden bg-[#f2f4f6] shrink-0">
                <Image src="/assets/travel_dashboard__img_01.png" alt="User" width={24} height={24} className="object-cover" />
              </div>
              <div>
                <p className="text-xs text-[#191c1e] leading-snug">{act.text}</p>
                <p className="text-[10px] text-[#76777d] mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
