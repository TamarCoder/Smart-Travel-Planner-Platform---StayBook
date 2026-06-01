"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, MapPin, PenLine, Plus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { createFeedPost, type FeedPost } from "@/lib/api/feed";
import { useAuthStore } from "@/stores";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export function FeedComposer() {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const publish = useMutation<FeedPost, Error>({
    mutationFn: () =>
      createFeedPost({
        authorId: user?.id ?? "me",
        authorName: user?.name ?? "You",
        authorAvatar: user?.avatar,
        location,
        caption,
        image,
        tags: tags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "infinite"] });
      toast.success("Shared to your feed");
      resetForm();
      setOpen(false);
    },
    onError: (error) => toast.error(error.message || "Could not share"),
  });

  function resetForm() {
    setCaption("");
    setLocation("");
    setTags("");
    setImage(undefined);
  }

  function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          <PenLine className="h-4 w-4" />
          Share a moment
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Share a moment</DialogTitle>
          <DialogDescription>Post a snapshot from the road to your public feed.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            publish.mutate();
          }}
          className="flex flex-col gap-4"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex aspect-3/2 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface-muted/40 text-text-secondary transition-colors hover:bg-surface-muted"
          >
            {image ? (
              <>
                <Image src={image} alt="Selected" fill className="object-cover" sizes="600px" />
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setImage(undefined);
                  }}
                  className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-950/70 text-white"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center gap-2 text-sm">
                <ImagePlus className="h-6 w-6" />
                Add a photo (optional)
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Where are you?"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 pl-10 text-sm outline-none focus:border-sky-600"
            />
          </div>

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Say something about this moment…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
          />

          <input
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Tags, comma separated (e.g. sunset, hiking)"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
          />

          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={publish.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {publish.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              Share
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
