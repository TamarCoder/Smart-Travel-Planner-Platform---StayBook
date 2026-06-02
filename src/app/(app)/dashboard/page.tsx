import DashboardShell from "./components/shell";
import DashboardMain from "./components/main";
import DashboardFooter from "./components/footer";

export default function DashboardPage() {
  return (
    <div>
      <DashboardShell />
      <DashboardMain />
      <DashboardFooter />
    </div>
  );
}
