import DashboardShell from "../components/shell";
import { BudgetDashboard } from "./components/budget-dashboard";

export default function BudgetPage() {
  return (
    <div>
      <DashboardShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
          <header className="mb-8">
            <p className="text-sm font-medium text-sky-600">Money</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Budgets & spending
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              See where every dollar is going across your trips. Filter by trip to drill in.
            </p>
          </header>
          <BudgetDashboard />
        </div>
      </main>
    </div>
  );
}