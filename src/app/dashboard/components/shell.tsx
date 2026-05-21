"use client";

import { useState } from "react";
import DashboardHeader from "./header";
import DashboardSidebar from "./sidebar";

export default function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <DashboardHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
