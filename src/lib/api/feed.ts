import { nanoid } from "nanoid";
import data from "@/data/feed.json";
import { fakeRequest, validationError } from "./client";

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
const USER_POSTS_KEY = "staybook.feedPosts";
const FALLBACK_IMAGE = "/assets/luxury_travel_planner_landing_page__img_03.png";

function readUserPosts(): FeedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_POSTS_KEY);
    return raw ? (JSON.parse(raw) as FeedPost[]) : [];
  } catch {
    return [];
  }
}

function writeUserPosts(posts: FeedPost[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_POSTS_KEY, JSON.stringify(posts));
  } catch {
    return;
  }
}

function allPosts(): FeedPost[] {
  return [...readUserPosts(), ...POSTS].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export async function listFeed(): Promise<FeedPost[]> {
  return fakeRequest(() => allPosts());
}

export interface FeedPage {
  items: FeedPost[];
  nextPage: number | null;
}

export async function listFeedPage(page = 0, pageSize = 3): Promise<FeedPage> {
  return fakeRequest(() => {
    const sorted = allPosts();
    const start = page * pageSize;
    const items = sorted.slice(start, start + pageSize);
    const nextPage = start + pageSize < sorted.length ? page + 1 : null;
    return { items, nextPage };
  });
}

export async function getPostById(id: string): Promise<FeedPost | undefined> {
  return fakeRequest(() => allPosts().find((p) => p.id === id));
}

export interface CreateFeedPostInput {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  location: string;
  caption: string;
  image?: string;
  tags?: string[];
}

export async function createFeedPost(input: CreateFeedPostInput): Promise<FeedPost> {
  return fakeRequest(() => {
    const caption = input.caption.trim();
    const location = input.location.trim();
    if (!caption) validationError("Add a caption before sharing");
    if (!location) validationError("Add a location before sharing");

    const post: FeedPost = {
      id: `post-${nanoid(10)}`,
      authorId: input.authorId,
      authorName: input.authorName,
      authorAvatar: input.authorAvatar,
      location,
      image: input.image?.trim() || FALLBACK_IMAGE,
      caption,
      likes: 0,
      comments: 0,
      tags: (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean).slice(0, 6),
      createdAt: new Date().toISOString(),
    };

    writeUserPosts([post, ...readUserPosts()]);
    return post;
  });
}
