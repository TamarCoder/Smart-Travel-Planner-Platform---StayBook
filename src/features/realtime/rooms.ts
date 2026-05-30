export function tripRoom(tripId: string) {
  return `trip:${tripId}`;
}

export function presenceRoom(tripId: string) {
  return `trip:${tripId}:presence`;
}

export function commentsRoom(tripId: string) {
  return `trip:${tripId}:comments`;
}

export type TripEventType =
  | "trip:updated"
  | "activity:added"
  | "activity:moved"
  | "activity:reordered"
  | "activity:deleted"
  | "comment:added"
  | "comment:reacted";