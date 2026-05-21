"use client";

import { useState } from "react";
import PlannerHeader from "./header";
import PlannerSidebar from "./sidebar";

export default function PlannerShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <PlannerHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <PlannerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
