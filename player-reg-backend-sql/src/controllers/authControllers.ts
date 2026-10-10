import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";
import { JWT_SECRET } from "../lib/env";
import { logActivity, logRequestActivity } from "../lib/activityLog";
import { canSeePrivateData, toPublicUser } from "../lib/privacy";

// POST /api/auth/logout — the token itself is stateless; this only records it
export const signOut = async (req: Request, res: Response): Promise<void> => {
  logRequestActivity(req, "User logged out");
  res.status(200).json({ success: true });
};

// Sends a 400 with a message the sign-up form shows to the user
const badRequest = (res: Response, message: string) => {
  res.status(400).json({ success: false, error: message, message });
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      firstName,
      lastName,
      nicNum,
      contact,
      dateofBirth,
      gender,
      district,
      profilePictureName,
      weight,
      height,
      idType,
      idFrontImage,
      idBackImage,
    } = req.body ?? {};

    // Validate before touching the database so users get a clear message
    const missing = Object.entries({
      email,
      password,
      firstName,
      lastName,
      contact,
      dateofBirth,
      gender,
      district,
      idType,
    })
      .filter(([, value]) => value === undefined || value === null || String(value).trim() === "")
      .map(([field]) => field);
    if (missing.length) {
      badRequest(res, `Missing required fields: ${missing.join(", ")}`);
      return;
    }

    const birthDate = new Date(dateofBirth);
    if (Number.isNaN(birthDate.getTime())) {
      badRequest(res, "Invalid date of birth");
      return;
    }
    const weightKg = parseInt(weight, 10);
    const heightCm = parseInt(height, 10);
    if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) {
      badRequest(res, "Please enter a valid height and weight");
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      badRequest(res, "An account with this email already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // User + player profile are created together: if either fails, neither
    // is saved (no half-created accounts that block re-registering).
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: fullName || `${firstName} ${lastName}`.trim(),
          email,
          password: hashedPassword,
          firstName,
          lastName,
          nicNum: nicNum ? String(nicNum).trim() : null,
          contact,
          dateofBirth: birthDate,
          gender,
          // Public sign-up always creates a pending player; admins are
          // created only by other admins (POST /api/admin/signupadmin).
          role: "player",
          status: "pending",
          district,
          // Optional: omit to use the default picture (null is not allowed)
          profilePictureName: profilePictureName || undefined,
        },
      });
      await tx.player.create({
        data: {
          userId: user.id,
          weight: weightKg,
          height: heightCm,
          idType,
          idFrontImage,
          idBackImage,
        },
      });
      return user;
    });

    logActivity(
      newUser.id,
      newUser.role,
      `New ${newUser.role} account registered (${newUser.email})`
    );
    res.status(201).json({ success: true, message: "Player registered successfully" });
  } catch (error) {
    // Unique NIC / email already used by another account
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      const target = String((error.meta as { target?: unknown })?.target ?? "");
      badRequest(
        res,
        target.includes("nicNum")
          ? "This NIC number is already registered"
          : "An account with these details already exists"
      );
      return;
    }
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Signup failed",
      message: "Registration failed. Please try again.",
    });
  }
};
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username: rawUsername, password } = req.body ?? {};
    if (!rawUsername || !password) {
      res.status(400).json({ error: "Username and password are required", message: "Please enter your email/NIC and password" });
      return;
    }
    const username = String(rawUsername).trim();

    // Email (ends with .com) or NIC number
    const user =
      username.toLowerCase().endsWith(".com")
        ? await prisma.user.findUnique({ where: { email: username } })
        : await prisma.user.findFirst({ where: { nicNum: username } });

    // Same response for "no such account" and "wrong password" so the
    // sign-in form can't be used to find out who is registered.
    const invalid = () =>
      res.status(401).json({ error: "Invalid credentials", message: "Incorrect email/NIC or password" });

    if (!user) {
      logActivity(
        null,
        "guest",
        `Failed login: no account for "${username.slice(0, 100)}"`
      );
      invalid();
      return;
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      logActivity(user.id, user.role, "Failed login: wrong password");
      invalid();
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    logActivity(user.id, user.role, "User logged in");

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Signin failed", message: "Sign-in failed. Please try again." });
  }
};
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userid } = req.params;

    let user;
    let id;

    if (userid) {
      id = parseInt(userid, 10);
      console.log("Assuming NIC number. NIC is:", id);
      user = await prisma.user.findFirst({ where: { id } });
      console.log("User found:", user);
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nicNum: user.nicNum,
        role: user.role,
        contact: user.contact,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user",
      message: "Failed to retrieve user",
    });
  }
};

export const getPlayerDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userid } = req.params;
    if (!userid) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Short numbers are user ids; long all-digit values are new-format NICs
    const asNumber = Number(userid);
    const isNumericId = /^\d{1,9}$/.test(userid) && Number.isFinite(asNumber);

    // Fetch user + player
    const user = isNumericId
      ? await prisma.user.findUnique({
          where: { id: asNumber },
          include: { player: true },
        })
      : await prisma.user.findFirst({
          where: { nicNum: userid },
          include: { player: true },
        });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch ONE pending payment (latest if somehow multiple exist now)
    const pendingPayment = await prisma.payment.findFirst({
      where: { userId: user.id, status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    const response = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      nicNum: user.nicNum,
      contact: user.contact,
      dateofBirth: user.dateofBirth,
      gender: user.gender,
      role: user.role,
      status: user.status,
      district: user.district,
      profilePictureName: user.profilePictureName,
      createdAt: user.createdAt,
      player: user.player
        ? {
            id: user.player.id,
            slbfId: user.player.slbfId,
            userId: user.player.userId,
            weight: user.player.weight,
            height: user.player.height,
            idType: user.player.idType,
            idFrontImage: user.player.idFrontImage,
            idBackImage: user.player.idBackImage,
            closeAssId: user.player.closeAssId,
            closeClubId: user.player.closeClubId,
            closeClubChagngeDate: user.player.closeClubChagngeDate,
            openAssId: user.player.openAssId,
            openClubId: user.player.openClubId,
            openClubChagngeDate: user.player.openClubChagngeDate,
            regDate: user.player.regDate,
            regExpDate: user.player.regExpDate,
            createdAt: user.player.createdAt,
            updatedAt: user.player.updatedAt,
          }
        : null,

      // ✅ The single pending payment for this user (or null)
      pendingPayment: pendingPayment
        ? {
            id: pendingPayment.id,
            userId: pendingPayment.userId,
            slipImage: pendingPayment.slipImage,
            referenceNo: pendingPayment.referenceNo,
            status: pendingPayment.status, // "pending"
            createdAt: pendingPayment.createdAt,
            updatedAt: pendingPayment.updatedAt,
          }
        : null,
    };

    // Full record only for the player themselves or an admin
    res.json(canSeePrivateData(req.user, user.id) ? response : toPublicUser(response));
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to retrieve user details", message: "Failed to retrieve user details" });
  }
};

export const getAllPlayers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Define the safe fields we want to expose
    // const userFields: Prisma.UserSelect = {
    //   id: true,
    //   firstName: true,
    //   lastName: true,
    //   email: true,
    //   nicNum: true,
    //   contact: true,
    //   dateofBirth: true,
    //   role: true,
    //   status: true,
    //   createdAt: true,
    //   updatedAt: true,
    //   // Explicitly exclude sensitive fields by omitting them
    // };

    // 2. Get optional query parameters for filtering/sorting
    const { sortBy = "firstName", sortOrder = "asc" } = req.query;

    // 3. Validate sortOrder
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // 4. Fetch users from database (password excluded — never send hashes to clients)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        nicNum: true,
        contact: true,
        dateofBirth: true,
        gender: true,
        role: true,
        status: true,
        district: true,
        profilePictureName: true,
        createdAt: true,
        player: true,
      },
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
      where: {
        // Optional: Add filters here if needed
        role: "player", // Assuming you only want players
      },
    });

    // 5. Send successful response
    res.status(200).json({
      success: true,
      data: users,
      meta: {
        count: users.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    }); 
  } catch (error) {
    console.error("Error fetching players:", error);

    // 6. Handle errors appropriately
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(400).json({
        success: false,
        error: "Database error",
        code: error.code,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }
};
