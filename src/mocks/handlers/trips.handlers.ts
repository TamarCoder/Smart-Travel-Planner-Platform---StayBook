import { http, HttpResponse, delay } from "msw";
import tripsDb from "@/mocks/db/trips.json";
import type { Trip } from "@/types";

const trips = tripsDb as Trip[];

export const tripHandlers = [
  http.get("/api/trips", async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const status = url.searchParams.get("status");

    let filtered = [...trips];
    if (userId) filtered = filtered.filter((t) => t.userId === userId);
    if (status) filtered = filtered.filter((t) => t.status === status);

    return HttpResponse.json({
      data: filtered,
      meta: { total: filtered.length, page: 1, pageSize: filtered.length, totalPages: 1 },
    });
  }),

  http.get("/api/trips/:id", async ({ params }) => {
    await delay(250);
    const trip = trips.find((t) => t.id === params.id);
    if (!trip) {
      return HttpResponse.json(
        { message: "Trip not found", code: "NOT_FOUND", status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: trip });
  }),

  http.post("/api/trips", async ({ request }) => {
    await delay(450);
    const body = (await request.json()) as Partial<Trip>;
    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      userId: body.userId ?? "usr_001",
      title: body.title ?? "New Trip",
      destinationId: body.destinationId ?? "",
      destination: body.destination ?? "",
      coverImage: body.coverImage ?? "",
      startDate: body.startDate ?? "",
      endDate: body.endDate ?? "",
      budget: body.budget ?? 0,
      currency: body.currency ?? "USD",
      status: "planning",
      collaborators: [],
      days: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newTrip }, { status: 201 });
  }),

  http.patch("/api/trips/:id", async ({ params, request }) => {
    await delay(300);
    const trip = trips.find((t) => t.id === params.id);
    if (!trip) {
      return HttpResponse.json(
        { message: "Trip not found", code: "NOT_FOUND", status: 404 },
        { status: 404 }
      );
    }
    const updates = (await request.json()) as Partial<Trip>;
    const updated = { ...trip, ...updates, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ data: updated });
  }),

  http.delete("/api/trips/:id", async ({ params }) => {
    await delay(300);
    const trip = trips.find((t) => t.id === params.id);
    if (!trip) {
      return HttpResponse.json(
        { message: "Trip not found", code: "NOT_FOUND", status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: { success: true } });
  }),
];
