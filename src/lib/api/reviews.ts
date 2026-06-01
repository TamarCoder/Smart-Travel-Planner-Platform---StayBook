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

export interface CreateReviewInput {
  entityType: ReviewEntityType;
  entityId: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  authorAvatar?: string;
}

const REVIEWS = data as Review[];
const STORAGE_KEY = "voyager:user-reviews";

function readUserReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function writeUserReviews(reviews: Review[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    return;
  }
}

export async function listReviews(
  entityType: ReviewEntityType,
  entityId: string,
): Promise<Review[]> {
  return fakeRequest(() =>
    [...readUserReviews(), ...REVIEWS]
      .filter((r) => r.entityType === entityType && r.entityId === entityId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  );
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  return fakeRequest(() => {
    const review: Review = {
      id: `rev-${crypto.randomUUID()}`,
      entityType: input.entityType,
      entityId: input.entityId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar,
      rating: input.rating,
      title: input.title.trim(),
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
    };
    writeUserReviews([review, ...readUserReviews()]);
    return review;
  });
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
