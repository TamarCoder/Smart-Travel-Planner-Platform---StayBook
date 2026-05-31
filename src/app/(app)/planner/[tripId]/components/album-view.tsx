"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAddPhoto, useRemovePhoto } from "@/features/trips";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogClose, DialogHiddenTitle } from "@/components/ui/dialog";
import type { DbTrip, TripPhoto } from "@/lib/api/db";

const MAX_BYTES = 6 * 1024 * 1024;

interface AlbumViewProps {
  trip: DbTrip;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export function AlbumView({ trip }: AlbumViewProps) {
  const photos = trip.album ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<TripPhoto | null>(null);
  const addPhoto = useAddPhoto();
  const removePhoto = useRemovePhoto();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} is larger than 6MB`);
          continue;
        }
        const dataUrl = await readAsDataUrl(file);
        await addPhoto.mutateAsync({
          tripId: trip.id,
          name: file.name,
          dataUrl,
          size: file.size,
        });
      }
      toast.success("Album updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(photoId: string) {
    try {
      await removePhoto.mutateAsync({ tripId: trip.id, photoId });
      setPreview(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete");
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Shared album</p>
          <h3
            className="mt-1 text-xl font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Memories from {trip.title}
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            {photos.length} {photos.length === 1 ? "photo" : "photos"} — everyone on the trip can contribute.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {uploading ? <Spinner className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
          Add photos
        </button>
      </header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-muted/40 px-6 py-16 text-center">
          <Camera className="h-8 w-8 text-sky-600" />
          <p className="text-sm font-medium text-text-primary">No photos yet</p>
          <p className="text-xs text-text-secondary">Drop in shots from the trip and your team can react and download.</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Upload first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setPreview(photo)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Image
                src={photo.dataUrl}
                alt={photo.caption ?? photo.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-left text-[11px] text-white">
                <p className="font-medium">{photo.uploaderName}</p>
                {photo.caption && <p className="line-clamp-1 opacity-80">{photo.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent size="lg" hideClose className="p-0 overflow-hidden">
          <DialogHiddenTitle>{preview?.caption ?? preview?.name ?? "Photo"}</DialogHiddenTitle>
          {preview && (
            <div className="relative">
              <div className="relative aspect-4/3 w-full bg-black">
                <Image
                  src={preview.dataUrl}
                  alt={preview.caption ?? preview.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{preview.uploaderName}</p>
                  <p className="text-xs text-text-secondary">{preview.caption ?? preview.name}</p>
                </div>
                <a
                  href={preview.dataUrl}
                  download={preview.name}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(preview.id)}
                  className="rounded-lg border border-border bg-surface p-2 text-text-muted hover:bg-error-bg hover:text-error-dark"
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-surface p-2 text-text-muted hover:bg-surface-hover"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
