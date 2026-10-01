import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

/**
 * GET /api/admin/logs — newest first.
 * Query: from, to (ISO date-time), role, user (name/email search or id),
 * page (1-based), pageSize.
 */
export const getActivityLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role, user } = req.query;
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(String(req.query.pageSize ?? DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
    );

    const where: Prisma.ActivityLogWhereInput = {};
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }
    if (typeof role === "string" && role.trim()) {
      where.role = role.trim();
    }
    if (typeof user === "string" && user.trim()) {
      const term = user.trim();
      if (/^\d+$/.test(term)) {
        where.userId = Number(term);
      } else {
        // Every word must match the first name, last name or email
        where.AND = term.split(/\s+/).map((word) => ({
          user: {
            OR: [
              { firstName: { contains: word } },
              { lastName: { contains: word } },
              { email: { contains: word } },
            ],
          },
        }));
      }
    }

    // Run both reads in parallel (a transaction adds round trips to the DB)
    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch logs" });
  }
};
