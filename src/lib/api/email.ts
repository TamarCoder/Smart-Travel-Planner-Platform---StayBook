const OUTBOX_KEY = "staybook.outbox";
const OUTBOX_LIMIT = 50;

export interface MockEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface SendMockEmailInput {
  to: string;
  subject: string;
  body: string;
}

function readOutbox(): MockEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY);
    return raw ? (JSON.parse(raw) as MockEmail[]) : [];
  } catch {
    return [];
  }
}

function writeOutbox(emails: MockEmail[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(emails.slice(0, OUTBOX_LIMIT)));
  } catch {
    return;
  }
}

export function getOutbox(): MockEmail[] {
  return readOutbox();
}

export function sendMockEmail(input: SendMockEmailInput): MockEmail | null {
  const to = input.to.trim();
  if (!to) return null;

  const email: MockEmail = {
    id: `mail-${Math.random().toString(36).slice(2, 12)}`,
    to,
    subject: input.subject.trim(),
    body: input.body.trim(),
    sentAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    writeOutbox([email, ...readOutbox()]);
    console.info(`📧 [mock email] To: ${email.to} — ${email.subject}`);
  }

  return email;
}
