import data from "@/data/feed.json";
import { fakeRequest } from "./client";

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
}

const POSTS = data as FeedPost[];

export async function listFeed(): Promise<FeedPost[]> {
  return fakeRequest(() =>
    POSTS.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  );
}

export interface FeedPage {
  items: FeedPost[];
  nextPage: number | null;
}

export async function listFeedPage(page = 0, pageSize = 3): Promise<FeedPage> {
  return fakeRequest(() => {
    const sorted = POSTS.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const start = page * pageSize;
    const items = sorted.slice(start, start + pageSize);
    const nextPage = start + pageSize < sorted.length ? page + 1 : null;
    return { items, nextPage };
  });
}

export async function getPostById(id: string): Promise<FeedPost | undefined> {
  return fakeRequest(() => POSTS.find((p) => p.id === id));
}
