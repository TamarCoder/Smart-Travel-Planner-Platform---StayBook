import DashboardHeader from "./components/header";
import DashboardSidebar from "./components/sidebar";
import DashboardMain from "./components/main";
import DashboardFooter from "./components/footer";

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <DashboardSidebar />
      <DashboardMain />
      <DashboardFooter />
    </div>
  );
}
