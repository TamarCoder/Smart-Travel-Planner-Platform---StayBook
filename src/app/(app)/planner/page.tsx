import PlannerShell from "./components/shell";
import PlannerMain from "./components/main";
import PlannerFooter from "./components/footer";

export default function Planner() {
  return (
    <div>
      <PlannerShell />
      <PlannerMain />
      <PlannerFooter />
    </div>
  );
}
