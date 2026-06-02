import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handlers";
import { destinationHandlers } from "./handlers/destinations.handlers";
import { tripHandlers } from "./handlers/trips.handlers";

export const worker = setupWorker(
  ...authHandlers,
  ...destinationHandlers,
  ...tripHandlers
);
