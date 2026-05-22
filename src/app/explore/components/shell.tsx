"use client";

import { useState } from "react";
import ExploreHeader from "./header";
import ExploreSidebar from "./sidebar";

export default function ExploreShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ExploreHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <ExploreSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
