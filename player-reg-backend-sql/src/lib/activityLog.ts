// Activity log (audit trail): who did what and when.
// Writes are fire-and-forget: a logging failure must never break the
// action being logged, so errors are only reported to the console.
import { Request } from "express";
import prisma from "./prisma";

const MAX_DESCRIPTION_LENGTH = 500;
// How often old logs are purged while the server is running
const PURGE_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

export type LogRole = "player" | "admin" | "guest" | string;

export const logActivity = (
  userId: number | null | undefined,
  role: LogRole | null | undefined,
  description: string
): void => {
  try {
    prisma.activityLog
      .create({
        data: {
          userId: userId ?? null,
          role: role || "guest",
          description: description.slice(0, MAX_DESCRIPTION_LENGTH),
        },
      })
      .catch((err) => console.error("Failed to write activity log:", err));
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
};

/** Logs an action by the authenticated user (from the JWT on the request). */
export const logRequestActivity = (req: Request, description: string) =>
  logActivity(req.user?.id, req.user?.role, description);

/** "First Last" for a user id, or "user #id" if they no longer exist. */
export const userDisplayName = async (
  userId: number | null | undefined
): Promise<string> => {
  if (!userId) return "unknown user";
  const user = await prisma.user
    .findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    })
    .catch(() => null);
  return user ? `${user.firstName} ${user.lastName}`.trim() : `user #${userId}`;
};

/** Deletes logs older than one month. */
export const purgeOldActivityLogs = async (): Promise<number> => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 1);
  const { count } = await prisma.activityLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  return count;
};

/** Purges once at startup, then every 12 hours. */
export const startActivityLogRetention = () => {
  const run = () =>
    purgeOldActivityLogs()
      .then((count) => {
        if (count > 0) console.log(`🧹 Deleted ${count} activity logs older than 1 month`);
      })
      .catch((err) => console.error("Failed to purge old activity logs:", err));

  run();
  setInterval(run, PURGE_INTERVAL_MS).unref();
};
