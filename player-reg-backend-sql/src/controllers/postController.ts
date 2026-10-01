// src/server/post.controller.ts
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

// Safe fields to expose for User
const SAFE_USER_SELECT = {
  id: true,
  fullName: true,
  firstName: true,
  lastName: true,
  email: true,
  district: true,
  profilePictureName: true,
  role: true,
  status: true,
} as const;

// util: remove undefined keys
function pruneUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/** -----------------------
 *  CREATE POST
 *  ----------------------*/
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, content, imageName, userId, createdAt } = req.body;

    // Validate input (imageName is required because your schema has String, not String?)
    if (!title || !content || !imageName || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, content, imageName, userId",
      });
      return;
    }

    // Ensure author exists (FK safety)
    const author = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true },
    });
    if (!author) {
      res.status(400).json({ success: false, message: "User (author) not found" });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title: String(title).trim(),
        subtitle: subtitle ? String(subtitle).trim() : undefined,
        content: String(content).trim(),
        imageName: String(imageName).trim(),
        userId: Number(userId),
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
      },
      include: { user: { select: SAFE_USER_SELECT } },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** -----------------------
 *  GET ALL POSTS (with user)
 *  ----------------------*/
export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: SAFE_USER_SELECT } },
    });

    res.status(200).json({
      success: true,
      message: "OK",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** -----------------------
 *  UPDATE POST (partial)
 *  Only the provided fields are updated; others remain unchanged.
 *  Author (userId) is NOT updatable by default to prevent ownership changes.
 *  ----------------------*/
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    // id can come from params or body (support both)
    const idRaw = (req.params.id ?? req.body.id) as string | number | undefined;
    const id = Number(idRaw);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ success: false, message: "Missing or invalid post id" });
      return;
    }

    const { title, subtitle, content, imageName, userId } = req.body;

    // Disallow changing author (userId) by default
    if (userId !== undefined) {
      res.status(400).json({
        success: false,
        message: "Changing author (userId) is not allowed",
      });
      return;
    }

    // Build partial update payload
    const changes = pruneUndefined({
      title: title !== undefined ? String(title).trim() : undefined,
      // if subtitle provided as empty string, set null to clear it
      subtitle:
        subtitle !== undefined
          ? (String(subtitle).trim() === "" ? null : String(subtitle).trim())
          : undefined,
      content: content !== undefined ? String(content).trim() : undefined,
      imageName: imageName !== undefined ? String(imageName).trim() : undefined,
      // userId intentionally omitted
    });

    // If nothing to update, return current record
    if (Object.keys(changes).length === 0) {
      const existing = await prisma.post.findUnique({
        where: { id },
        include: { user: { select: SAFE_USER_SELECT } },
      });
      if (!existing) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "No changes applied",
        data: existing,
      });
      return;
    }

    const updated = await prisma.post.update({
      where: { id },
      data: changes,
      include: { user: { select: SAFE_USER_SELECT } },
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updated,
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** -----------------------
 *  DELETE POST
 *  ----------------------*/
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    // id can come from params or body (support both)
    const idRaw = (req.params.id ?? req.body.id) as string | number | undefined;
    const id = Number(idRaw);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ success: false, message: "Missing or invalid post id" });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getPostCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, q, from, to } = req.query;

    const where: Prisma.PostWhereInput = {};

    if (userId) where.userId = Number(userId);

    if (q && String(q).trim()) {
      const term = String(q).trim();
      where.OR = [
        // { title: { contains: term, mode: "insensitive" } },
        // { subtitle: { contains: term, mode: "insensitive" } },
        // { content: { contains: term, mode: "insensitive" } },
        { title: { contains: term} },
        { subtitle: { contains: term} },
        { content: { contains: term} },
      ];
    }

    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(String(from)) } : {}),
        ...(to ? { lte: new Date(String(to)) } : {}),
      };
    }

    const count = await prisma.post.count({ where });

    res.status(200).json({
      success: true,
      message: "OK",
      data: { count },
    });
  } catch (error) {
    console.error("Error getting post count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
