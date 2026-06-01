"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Mail, Plus, UserPlus } from "lucide-react";
import { nanoid } from "nanoid";
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
import { useAddCollaborator } from "@/features/trips";
import { sendMockEmail } from "@/lib/api/email";
import { inviteSchema, type InviteInput } from "@/lib/validations/collaborator";

interface InviteDialogProps {
  tripId: string;
  tripTitle: string;
}

export function InviteDialog({ tripId, tripTitle }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const addCollaborator = useAddCollaborator();

  const inviteToken = useMemo(() => nanoid(16), []);
  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${tripId}?token=${inviteToken}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", role: "Editor" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await addCollaborator.mutateAsync({
        tripId,
        name: values.name,
        email: values.email,
        role: values.role,
      });
      sendMockEmail({
        to: values.email,
        subject: `You're invited to plan ${tripTitle}`,
        body: `${values.name}, you've been added as a ${values.role}. Open this link to join: ${inviteLink}`,
      });
      toast.success(`${values.name} added to ${tripTitle}`, {
        description: `📧 Invitation email sent to ${values.email}`,
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not invite");
    }
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  }

  const busy = isSubmitting || addCollaborator.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-hover"
        >
          <UserPlus className="h-3.5 w-3.5 text-sky-600" />
          Invite
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Invite to {tripTitle}</DialogTitle>
          <DialogDescription>
            Add teammates by email, or share a magic link for instant access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-text-secondary">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Sofia Castellanos"
                aria-invalid={!!errors.name}
                {...register("name")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600 aria-invalid:border-error"
              />
              {errors.name && <p className="text-xs text-error-dark">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-medium text-text-secondary">Role</label>
              <select
                id="role"
                {...register("role")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Companion">Companion</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                type="email"
                placeholder="sofia@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 pl-10 text-sm outline-none focus:border-sky-600 aria-invalid:border-error"
              />
            </div>
            {errors.email && <p className="text-xs text-error-dark">{errors.email.message}</p>}
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-surface-muted/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Magic link</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 truncate rounded-lg border border-border bg-surface px-2 py-2 text-xs text-text-secondary"
              />
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-surface-hover"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-text-secondary">
              Anyone with this link can view the trip. Revoke from the collaborators list.
            </p>
          </div>

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
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              Send invite
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
