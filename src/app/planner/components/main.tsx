import Image from "next/image";
import { Edit, Filter, Calendar, Plane, Car, Hotel, Plus, ChevronUp, ChevronDown, Map, Wallet, Cloud, MapPin } from "lucide-react";
import { getTripById } from "@/lib/api/trips";

export default function PlannerMain() {
  const trip = getTripById("trip-001");
  const day1 = trip?.itinerary[0];
  const day2 = trip?.itinerary[1];

  return (
    <main className="lg:ml-64 mt-16 px-4 md:px-12 py-12 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">

        <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-10 shadow-xl">
          <Image
            src="/assets/smart_trip_planner__img_03.png"
            alt={trip?.title ?? "Trip"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                Featured
              </span>
              <span className="text-white/80 text-sm font-medium">
                {new Date(trip?.startDate ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                {new Date(trip?.endDate ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              {trip?.title}
            </h1>
          </div>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center hover:bg-white/40 transition-all cursor-pointer">
            <Edit className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-navy-950" style={{ fontFamily: "var(--font-display)" }}>
                Itinerary
              </h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl border border-border-strong hover:bg-surface-hover transition-colors cursor-pointer">
                  <Filter className="h-4 w-4 text-text-secondary" />
                </button>
                <button className="p-2 rounded-xl border border-border-strong hover:bg-surface-hover transition-colors cursor-pointer">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                </button>
              </div>
            </div>

            <section className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 relative">
              <div className="absolute left-[47px] top-[88px] bottom-10 w-0.5 border-l-2 border-dashed border-border-strong/30" />
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-950 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">Day</span>
                    <span className="text-lg font-extrabold leading-none">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-950" style={{ fontFamily: "var(--font-display)" }}>
                      {day1?.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {new Date(day1?.date ?? "").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <button className="text-text-secondary hover:text-navy-950 transition-colors cursor-pointer">
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5 ml-4">
                {day1?.activities.map((act, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <div key={act.id} className="flex gap-4 cursor-grab active:cursor-grabbing">
                      <div className="flex flex-col items-center pt-1">
                        <div className={`w-4 h-4 rounded-full z-10 shrink-0 ${isFirst ? "bg-sky-600 ring-4 ring-sky-600/20" : "bg-border-strong"}`} />
                      </div>
                      <div className={`flex-1 bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:shadow-md transition-all ${isFirst ? "border-l-4 border-l-sky-600" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {act.type === "flight" && <Plane className="h-5 w-5 text-sky-600 shrink-0" />}
                            {act.type === "transfer" && <Car className="h-5 w-5 text-text-secondary shrink-0" />}
                            {act.type === "hotel" && <Hotel className="h-5 w-5 text-text-secondary shrink-0" />}
                            <div>
                              <p className="text-sm font-semibold text-navy-950">{act.title}</p>
                              <p className="text-xs text-text-secondary">{act.detail}</p>
                            </div>
                          </div>
                          {act.status === "confirmed" && (
                            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded shrink-0">
                              Confirmed
                            </span>
                          )}
                        </div>
                        {act.type === "hotel" && (
                          <div className="mt-3 h-36 rounded-xl overflow-hidden relative">
                            <Image
                              src="/assets/smart_trip_planner__img_05.png"
                              alt="Hotel"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="mt-6 ml-8 border-2 border-dashed border-border-strong/40 w-full py-3 rounded-xl text-text-secondary hover:bg-surface-hover transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium">
                <Plus className="h-4 w-4" />
                Add Activity
              </button>
            </section>

            <section className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 opacity-80 hover:opacity-100 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-hover text-text-secondary flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">Day</span>
                    <span className="text-lg font-extrabold leading-none">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-secondary" style={{ fontFamily: "var(--font-display)" }}>
                      {day2?.title}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {new Date(day2?.date ?? "").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} • 4 Activities
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-text-secondary" />
              </div>
            </section>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-navy-950">Trip Management</h3>
              {[
                { icon: Map, label: "Route Optimization" },
                { icon: Wallet, label: "Budget Breakdown" },
                { icon: Cloud, label: "Weather Forecast" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-sky-600" />
                    <span className="text-sm font-medium text-navy-950">{label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
                </div>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-md cursor-pointer">
              <div className="h-48 w-full relative">
                <Image
                  src="/assets/smart_trip_planner__img_06.png"
                  alt="Map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-sky-600/10 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/40">
                    <MapPin className="h-4 w-4 text-sky-600" />
                    <span className="text-sm font-medium text-navy-950">Expand Map</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Upcoming Stop</p>
                  <span className="text-sky-600 text-xs font-medium">45km away</span>
                </div>
                <h4 className="text-sm font-semibold text-navy-950">Ravello Viewpoint</h4>
                <p className="text-xs text-text-secondary">Recommended for lunch on Day 3</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-navy-950">Live Updates</h3>
              {[
                { img: "/assets/smart_trip_planner__img_01.png", name: "Marco", text: <>added <span className="text-sky-600 font-medium">&quot;Boat Tour&quot;</span> to Day 4</> , time: "2 minutes ago" },
                { img: "/assets/smart_trip_planner__img_02.png", name: "Sofia", text: <>updated the flight status</>, time: "1 hour ago" },
              ].map(({ img, name, text, time }) => (
                <div key={name} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image src={img} alt={name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-navy-950">
                      <span className="font-semibold">{name}</span>{" "}{text}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
