import { PlannerContent } from "./components/planner-content";

export default async function PlannerTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  return <PlannerContent tripId={tripId} />;
}
