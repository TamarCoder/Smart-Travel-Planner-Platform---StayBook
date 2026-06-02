export const commentsKeys = {
  all: ["comments"] as const,
  byTrip: (tripId: string) => [...commentsKeys.all, "trip", tripId] as const,
  byActivity: (activityId: string) => [...commentsKeys.all, "activity", activityId] as const,
};
