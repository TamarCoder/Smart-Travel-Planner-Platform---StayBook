"use client";

import { useState } from "react";
import BookingHeader from "./header";
import BookingSidebar from "./sidebar";

export default function BookingShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <BookingHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <BookingSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
