import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";
import { logRequestActivity } from "../lib/activityLog";

export const regRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // The player is whoever is logged in; a userId in the body is ignored
    const userId = Number(req.user?.id);
    const { slipImage, referenceNo } = req.body ?? {};

    if (!slipImage || !referenceNo) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: slipImage or referenceNo",
      });
      return;
    }
    // One pending payment at a time
    const pending = await prisma.payment.findFirst({ where: { userId, status: "pending" } });
    if (pending) {
      res.status(400).json({ success: false, message: "You already have a payment waiting for approval." });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        referenceNo,
        slipImage,
      },
    });
    logRequestActivity(
      req,
      `Submitted registration payment slip (Ref: ${referenceNo})`
    );

    res.status(201).json({
      success: true,
      message: "Payment slip uploaded successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Error creating payment record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clubchangeRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // The player is whoever is logged in; a userId in the body is ignored
    const userId = Number(req.user?.id);
    const { type, newImage, newClubId, newAssId, newClub, newAss, newClubCode, newAssCode, currentClubId, currentClubCode, currentAssId, currentAssCode,  currentImage, resignDate, currentClub, currentAss } = req.body ?? {};

    // Validate input
    if (!type || !newImage || !newAssId || !newAssCode) {
      res.status(400).json({
        success: false,
        message: "Missing required fields!",
      });
      return;
    }
    if (type !== "open" && type !== "close") {
      res.status(400).json({ success: false, message: "type must be \"open\" or \"close\"" });
      return;
    }
    // One pending request per type at a time
    const pending = await prisma.clubchange.findFirst({ where: { userId, type, status: "pending" } });
    if (pending) {
      res.status(400).json({ success: false, message: `You already have a pending ${type} club change request. Please wait for it to be reviewed.` });
      return;
    }

    // Create new club change request using `clubchange` model
    const clubChange = await prisma.clubchange.create({
      data: {
        userId,
        type,
        oldAssId: currentAssId || null,
        oldAssName: currentAss || null,
        oldAssCode: currentAssCode || null,
        oldClubId: currentClubId || null,
        oldClubName: currentClub || null,
        oldClubCode: currentClubCode || null,
        oldImage: currentImage || null,
        newAssId: newAssId,
        newAssName: newAss,
        newAssCode: newAssCode,
        newClubId: newClubId || null,
        newClubName: newClub || null,
        newClubCode: newClubCode || null,
        newImage,
        resignDate: resignDate,
      },
    });
    logRequestActivity(
      req,
      `Requested ${type} club change to ${newAss || newAssCode}${
        newClub ? ` / ${newClub}` : ""
      }`
    );

    res.status(201).json({
      success: true,
      message: "Club change request successfully submitted",
      data: clubChange,
    });
  } catch (error) {
    console.error("Error creating club change request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserAndPlayer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Players can only edit their own profile: the id comes from the token
    const userId = Number(req.user?.id);
    const { firstName, lastName, contact, email, height, weight } =
      req.body ?? {};
    // Empty strings mean "not changed", never "erase"
    const keep = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

    // Update user and player together in a transaction
    const [updatedUser, updatedPlayer] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          firstName: keep(firstName) as string | undefined,
          lastName: keep(lastName) as string | undefined,
          contact: keep(contact) as string | undefined,
          email: keep(email) as string | undefined,
        },
        omit: { password: true },
      }),
      prisma.player.update({
        where: { userId },
        data: {
          height: height ? parseInt(height) : undefined,
          weight: weight ? parseInt(weight) : undefined,
        },
      }),
    ]);
    const changedFields = Object.entries({
      firstName,
      lastName,
      contact,
      email,
      height,
      weight,
    })
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([field]) => field);
    logRequestActivity(
      req,
      `Updated profile details (${changedFields.join(", ") || "no fields"})`
    );

    res.status(200).json({
      success: true,
      message: "User and Player updated successfully.",
      data: {
        user: updatedUser,
        player: updatedPlayer,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(400).json({ success: false, message: "This email is already used by another account" });
      return;
    }
    console.error("Error updating user and player:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const defaultDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // associationId can come from params or query

    let defaultDetails = await prisma.setting.findFirst({
      where: { id: 1 }, // assuming there's only one row with id=1
    });


    res.status(200).json({
      success: true,
      data: defaultDetails,
    });
  } catch (error) {
    console.error("Error fetching association:", error);

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
        message: "Internal server error",
      });
    }
  }
};
