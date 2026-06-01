"use client";

import { useState } from "react";
import DashboardShell from "../components/shell";
import { SavedGrid } from "./components/saved-grid";

export default function SavedPage() {
  const [tab, setTab] = useState<"destinations" | "hotels">("destinations");
  return (
    <div>
      <DashboardShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-10">
          <header className="mb-8">
            <p className="text-sm font-medium text-sky-600">Library</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Saved for later
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Destinations and stays you have hearted across Voyager. Everything stays in sync across your devices.
            </p>
          </header>

          <SavedGrid activeTab={tab} onTabChange={setTab} />
        </div>
      </main>
    </div>
  );
}
