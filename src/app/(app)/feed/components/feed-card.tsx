"use client";

import Image from "next/image";
import { Heart, MapPin, MessageCircle, Share2, UserPlus, UserMinus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useSocialStore } from "@/stores";
import type { FeedPost } from "@/lib/api/feed";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  post: FeedPost;
}

export function FeedCard({ post }: FeedCardProps) {
  const liked = useSocialStore((s) => Boolean(s.likedPostIds[post.id]));
  const following = useSocialStore((s) => Boolean(s.followedUserIds[post.authorId]));
  const toggleLike = useSocialStore((s) => s.togglePostLike);
  const toggleFollow = useSocialStore((s) => s.toggleFollow);

  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-sm">
      <header className="flex items-center gap-3 px-5 py-4">
        <Avatar src={post.authorAvatar} fallback={post.authorName} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{post.authorName}</p>
          <p className="inline-flex items-center gap-1 text-xs text-text-secondary">
            <MapPin className="h-3 w-3 text-sky-600" />
            {post.location}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleFollow(post.authorId)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            following
              ? "border-border bg-surface text-text-secondary"
              : "border-sky-600 bg-sky-600 text-white hover:bg-sky-700",
          )}
        >
          {following ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
          {following ? "Following" : "Follow"}
        </button>
      </header>

      <div className="relative aspect-4/5 w-full sm:aspect-3/2">
        <Image
          src={post.image}
          alt={post.location}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-4 px-5 py-3">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
            liked ? "text-rose-500" : "text-text-secondary hover:text-text-primary",
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-rose-500")} />
          {likeCount.toLocaleString()}
        </button>
        <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
          <MessageCircle className="h-4 w-4" />
          {post.comments}
        </span>
        <button
          type="button"
          aria-label="Share"
          className="ml-auto inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pb-5">
        <p className="text-sm leading-relaxed text-text-primary">
          <span className="font-semibold">{post.authorName.split(" ")[0]}</span> {post.caption}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-sky-600">
              #{tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-text-muted">
          {formatTime(post.createdAt)}
        </p>
      </div>
    </article>
  );
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
