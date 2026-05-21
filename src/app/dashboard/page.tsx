import DashboardHeader from "./components/header";
import DashboardSidebar from "./components/sidebar";
import DashboardMain from "./components/main";

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <DashboardSidebar />
      <DashboardMain />
    </div>
  );
}
