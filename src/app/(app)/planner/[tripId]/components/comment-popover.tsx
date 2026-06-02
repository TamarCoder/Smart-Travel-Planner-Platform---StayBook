"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Send, SmilePlus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  REACTION_EMOJIS,
  useCreateComment,
  useDeleteComment,
  useToggleReaction,
  useTripComments,
  commentsKeys,
} from "@/features/comments";
import { useChannelListener } from "@/features/realtime";
import { commentsRoom } from "@/features/realtime/rooms";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { ReactionEmoji } from "@/features/comments";

interface CommentPopoverProps {
  tripId: string;
  activityId: string;
  activityTitle: string;
  count: number;
}

export function CommentPopover({ tripId, activityId, activityTitle, count }: CommentPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const comments = useTripComments(tripId);
  const create = useCreateComment();
  const remove = useDeleteComment(tripId);
  const react = useToggleReaction(tripId);

  useChannelListener(commentsRoom(tripId), () => {
    queryClient.invalidateQueries({ queryKey: commentsKeys.byTrip(tripId) });
  });

  const list = useMemo(
    () => (comments.data ?? []).filter((c) => c.activityId === activityId),
    [comments.data, activityId],
  );

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setDraft("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    try {
      await create.mutateAsync({ tripId, activityId, text });
      setDraft("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post");
    }
  }

  async function handleReact(commentId: string, emoji: ReactionEmoji) {
    try {
      await react.mutateAsync({ commentId, emoji });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not react");
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await remove.mutateAsync(commentId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open comments"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[10px] font-medium text-text-secondary transition-colors hover:border-border-strong"
        >
          <MessageCircle className="h-3 w-3" />
          {count}
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Comments</DialogTitle>
          <DialogDescription>{activityTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
          {comments.isPending ? (
            <div className="flex h-20 items-center justify-center">
              <Spinner className="h-4 w-4 text-sky-500" />
            </div>
          ) : list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-xs text-text-secondary">
              Be the first to leave a note for the team.
            </p>
          ) : (
            list.map((comment) => (
              <article key={comment.id} className="rounded-2xl border border-border bg-surface p-3">
                <header className="flex items-start gap-3">
                  <Avatar src={comment.authorAvatar} fallback={comment.authorName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-text-primary">{comment.authorName}</p>
                      <span className="text-[10px] text-text-muted">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{comment.text}</p>
                  </div>
                  {comment.authorId === userId && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="rounded-lg p-1.5 text-text-muted hover:bg-error-bg hover:text-error-dark"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </header>

                <footer className="mt-3 flex flex-wrap items-center gap-2">
                  {REACTION_EMOJIS.map((emoji) => {
                    const reactedUsers = comment.reactions[emoji] ?? [];
                    const active = userId ? reactedUsers.includes(userId) : false;
                    if (!active && reactedUsers.length === 0) return null;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReact(comment.id, emoji)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                          active
                            ? "border-sky-600 bg-sky-500/10 text-sky-700"
                            : "border-border text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{emoji}</span>
                        <span>{reactedUsers.length}</span>
                      </button>
                    );
                  })}
                  <ReactionPicker onPick={(emoji) => handleReact(comment.id, emoji)} />
                </footer>
              </article>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment…"
            maxLength={280}
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
          />
          <button
            type="submit"
            disabled={!draft.trim() || create.isPending}
            className="inline-flex items-center gap-1 rounded-xl bg-navy-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {create.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
            Send
          </button>
          <DialogClose asChild>
            <button
              type="button"
              className="hidden rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-medium text-text-secondary hover:bg-surface-hover md:inline-flex"
            >
              Close
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReactionPicker({ onPick }: { onPick: (emoji: ReactionEmoji) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:border-border-strong"
        aria-label="Add reaction"
      >
        <SmilePlus className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute bottom-full left-0 z-40 mb-2 flex gap-1 rounded-full border border-border bg-surface px-2 py-1 shadow-md">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onPick(emoji);
                  setOpen(false);
                }}
                className="rounded-full p-1 text-base hover:bg-surface-muted"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}