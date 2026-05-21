import { http, HttpResponse, delay } from "msw";
import destinationsDb from "@/mocks/db/destinations.json";
import type { Destination } from "@/types";

const destinations = destinationsDb as Destination[];

export const destinationHandlers = [
  http.get("/api/destinations", async ({ request }) => {
    await delay(350);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 6);
    const search = url.searchParams.get("search")?.toLowerCase();
    const continent = url.searchParams.get("continent");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const minRating = url.searchParams.get("minRating");

    let filtered = [...destinations];

    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.country.toLowerCase().includes(search) ||
          d.tags.some((t) => t.includes(search))
      );
    }
    if (continent) {
      filtered = filtered.filter((d) => d.continent === continent);
    }
    if (minPrice) {
      filtered = filtered.filter((d) => d.priceFrom >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((d) => d.priceFrom <= Number(maxPrice));
    }
    if (minRating) {
      filtered = filtered.filter((d) => d.rating >= Number(minRating));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      meta: { total, page, pageSize, totalPages },
    });
  }),

  http.get("/api/destinations/:slug", async ({ params }) => {
    await delay(300);
    const dest = destinations.find((d) => d.slug === params.slug);
    if (!dest) {
      return HttpResponse.json(
        { message: "Destination not found", code: "NOT_FOUND", status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: dest });
  }),
];
