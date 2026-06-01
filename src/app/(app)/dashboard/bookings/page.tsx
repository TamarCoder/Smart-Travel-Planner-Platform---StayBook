import { Suspense } from "react";
import DashboardShell from "../components/shell";
import { Spinner } from "@/components/ui/spinner";
import { BookingsList } from "./components/bookings-list";

export default function BookingsPage() {
  return (
    <div>
      <DashboardShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-10">
          <header className="mb-8">
            <p className="text-sm font-medium text-sky-600">Stays</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My bookings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Everything you have reserved across Voyager. Cancel within 48 hours for free.
            </p>
          </header>
          <Suspense fallback={<div className="flex h-32 items-center justify-center"><Spinner className="h-6 w-6 text-sky-500" /></div>}>
            <BookingsList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
