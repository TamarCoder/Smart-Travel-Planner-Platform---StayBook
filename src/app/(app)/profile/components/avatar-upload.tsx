"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;

interface AvatarUploadProps {
  name?: string;
  avatar?: string;
  onUpload: (dataUrl: string) => Promise<void> | void;
  className?: string;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({ name, avatar, onUpload, className }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 2MB or smaller");
      return;
    }
    try {
      setBusy(true);
      const dataUrl = await readFileAsDataUrl(file);
      await onUpload(dataUrl);
      toast.success("Avatar updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed. Try again.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative">
        <Avatar src={avatar} fallback={name} size="xl" />
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
          Change avatar
        </button>
        <p className="text-xs text-text-muted">PNG, JPG up to 2MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
