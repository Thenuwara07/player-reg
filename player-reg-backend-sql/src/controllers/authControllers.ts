import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";
import { JWT_SECRET } from "../lib/env";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  console.log("Received signup request with body:", req.body);
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
      role,
      status,
      district,
      profilePictureName,
      weight,
      height,
      idType,
      idFrontImage,
      idBackImage,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        nicNum : nicNum ? nicNum : undefined,
        contact,
        dateofBirth: new Date(dateofBirth),
        gender,
        role,
        status,
        district,
        profilePictureName,
      },
    });
    console.log("Creating player profile for user:", newUser.id);
    if (role === "player") {
      console.log("2");
      await prisma.player.create({
        data: {
          userId: newUser.id,
          weight: parseInt(weight),
          height: parseInt(height),
          idType,
          idFrontImage,
          idBackImage,
        },
      });
      res.status(201).json({ success: "Player registered successfully" });
    }
    console.log("3");

    res.status(201).json({ success: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Signup failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    // Declare email in outer scope
    let email;
    let user;
    let nicNum;

    if (username.slice(-4) === ".com") {
      email = username;
      console.log("Valid email format. Email is:", email);
      user = await prisma.user.findUnique({ where: { email } }); // assign to outer 'user'
    } else {
      console.log("Invalid email format: must end with .com, may be NIC");
      nicNum = username;
      user = await prisma.user.findFirst({ where: { nicNum } }); // assign to outer 'user'
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

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
    res.status(500).json({
      error: "Signin failed",
      details: error instanceof Error ? error.message : error,
    });
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
      details: error instanceof Error ? error.message : error,
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

    const asNumber = Number(userid);
    const isNumericId = Number.isFinite(asNumber);

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

    res.json(response);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      error: "Failed to retrieve user details",
      details: error instanceof Error ? error.message : error,
    });
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
