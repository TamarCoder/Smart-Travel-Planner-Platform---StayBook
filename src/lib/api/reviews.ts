import data from "@/data/reviews.json";
import { fakeRequest } from "./client";

export type ReviewEntityType = "destination" | "hotel";

export interface Review {
  id: string;
  entityType: ReviewEntityType;
  entityId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

const REVIEWS = data as Review[];

export async function listReviews(
  entityType: ReviewEntityType,
  entityId: string,
): Promise<Review[]> {
  return fakeRequest(() =>
    REVIEWS.filter((r) => r.entityType === entityType && r.entityId === entityId).sort(
      (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
    ),
  );
}

export function summariseReviews(reviews: Review[]) {
  if (reviews.length === 0) {
    return { count: 0, average: 0, breakdown: [] as { stars: number; count: number }[] };
  }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));
  return { count: reviews.length, average, breakdown };
}
