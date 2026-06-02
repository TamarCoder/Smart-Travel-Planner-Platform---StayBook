"use client";

import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Download, FileImage, FileText, Paperclip, Trash2, X } from "lucide-react";
import { toast } from "sonner";
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
import { useUpdateActivity } from "@/features/trips";
import type { TripActivity, TripAttachment } from "@/lib/api/db";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;

interface AttachmentDialogProps {
  tripId: string;
  dayIndex: number;
  activity: TripActivity;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentDialog({ tripId, dayIndex, activity }: AttachmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateActivity = useUpdateActivity();
  const attachments = activity.attachments ?? [];

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const next: TripAttachment[] = [...attachments];
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} is larger than 5MB`);
          continue;
        }
        const dataUrl = await readAsDataUrl(file);
        next.push({
          id: `att-${nanoid(8)}`,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      await updateActivity.mutateAsync({
        tripId,
        dayIndex,
        activityId: activity.id,
        patch: { attachments: next },
      });
      toast.success("Attachment saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(attachmentId: string) {
    try {
      await updateActivity.mutateAsync({
        tripId,
        dayIndex,
        activityId: activity.id,
        patch: { attachments: attachments.filter((a) => a.id !== attachmentId) },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Attachments"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[10px] font-medium text-text-secondary transition-colors hover:border-border-strong"
        >
          <Paperclip className="h-3 w-3" />
          {attachments.length}
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Attachments</DialogTitle>
          <DialogDescription>{activity.title}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {attachments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-xs text-text-secondary">
              Drop boarding passes, tickets or photos here for the whole team to see.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {attachments.map((attachment) => {
                const isImage = attachment.mimeType.startsWith("image/");
                const Icon = isImage ? FileImage : FileText;
                return (
                  <li
                    key={attachment.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                  >
                    <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600")}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">{attachment.name}</p>
                      <p className="text-xs text-text-secondary">{formatBytes(attachment.size)}</p>
                    </div>
                    <a
                      href={attachment.dataUrl}
                      download={attachment.name}
                      className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary"
                      aria-label={`Download ${attachment.name}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemove(attachment.id)}
                      className="rounded-lg p-1.5 text-text-muted hover:bg-error-bg hover:text-error-dark"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-hover disabled:opacity-60"
          >
            {uploading ? <Spinner className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
            Attach files
          </button>
          <p className="text-[10px] text-text-muted text-center">Up to 5MB per file. Images, PDFs, tickets.</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <DialogClose asChild>
          <button
            type="button"
            className="mt-4 self-end rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
          >
            <X className="mr-1 inline h-3.5 w-3.5" />
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
