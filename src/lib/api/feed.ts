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

export async function getPostById(id: string): Promise<FeedPost | undefined> {
  return fakeRequest(() => POSTS.find((p) => p.id === id));
}
