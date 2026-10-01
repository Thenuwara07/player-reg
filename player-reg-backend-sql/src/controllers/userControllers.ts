import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";

export const regRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, slipImage, referenceNo } = req.body;

    // Corrected validation
    if (!userId || !slipImage || !referenceNo) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: userId or slipImage",
      });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        userId: parseInt(userId, 10),
        referenceNo,
        slipImage,
      },
    });

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
    const { userId, type, newImage, newClubId, newAssId, newClub, newAss, newClubCode, newAssCode, currentClubId, currentClubCode, currentAssId, currentAssCode,  currentImage, resignDate, currentClub, currentAss } = req.body;

    // Validate input
    if (!userId || !type || !newImage || !newAssId || !newAssCode) {
      res.status(400).json({
        success: false,
        message: "Missing required fields!",
      });
      return;
    }
    

    // Create new club change request using `clubchange` model
    console.log("Creating club change request for userId:", resignDate);
    const clubChange = await prisma.clubchange.create({
      data: {
        userId: parseInt(userId, 10),
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
    const { userId, firstName, lastName, contact, email, height, weight } =
      req.body;
    // Validate input
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Missing required field: userId",
      });
      return;
    }

    // Update user and player together in a transaction
    const [updatedUser, updatedPlayer] = await prisma.$transaction([
      prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          firstName,
          lastName,
          contact,
          email,
        },
      }),
      prisma.player.update({
        where: { userId: parseInt(userId) },
        data: {
          height: height ? parseInt(height) : undefined,
          weight: weight ? parseInt(weight) : undefined,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "User and Player updated successfully.",
      data: {
        user: updatedUser,
        player: updatedPlayer,
      },
    });
  } catch (error) {
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
        message: (error as Error).message,
      });
    }
  }
};
