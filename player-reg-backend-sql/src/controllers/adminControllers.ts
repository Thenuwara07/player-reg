import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client"; // <-- ensure Prisma is imported
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getPendingPlayers = async (
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
    const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

    // 3. Validate sortOrder
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // 4. Fetch users from database
    const users = await prisma.user.findMany({
      // select: userFields,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // Optional: Add filters here if needed
        status: "pending", // Assuming you only want players
        role: "player",
      },
      include: {
        player: true,
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

export const updatetableField = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { table, id, column, value } = req.body;

    // Validate input
    if (!id || !column || !table || value === undefined) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: userId, column, table or value",
      });
      return;
    }


    // Build dynamic update object
    const updateData: Record<string, any> = {};
    updateData[column] = value;

    // Perform update
    // Dynamically access the model and perform the update
    const updatedRecord = await (prisma as any)[table].update({
      where: { id: parseInt(id) },
      data: { [column]: value },
    });

    res.status(200).json({
      success: true,
      message: `Updated ${column} successfully.`,
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating user field:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatetableFields = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { table, id, updates } = req.body;

    // Validate input
    if (!id || !table || !updates || typeof updates !== "object") {
      res.status(400).json({
        success: false,
        message: "Missing required fields: table, id, or updates object",
      });
      return;
    }

    // Perform update
    const updatedRecord = await (prisma as any)[table].update({
      where: { id: parseInt(id, 10) },
      data: updates,
    });

    res.status(200).json({
      success: true,
      message: `Updated record successfully.`,
      // data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPendingReg = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 2. Get optional query parameters for filtering/sorting
    const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

    // 3. Validate sortOrder
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // 4. Fetch users from database
    const users = await prisma.payment.findMany({
      // select: userFields,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // Optional: Add filters here if needed
        status: "pending",
      },
      include: {
        user: {
          include: {
            player: true, // get related Player through User
          },
        },
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

export const getClubchangePendingReq = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 2. Get optional query parameters for filtering/sorting
    const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

    // 3. Validate sortOrder
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // 4. Fetch users from database
    const reqdata = await prisma.clubchange.findMany({
      // select: userFields,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // Optional: Add filters here if needed
        status: "pending",
      },
      include: {
        user: {
          include: {
            player: true, // get related Player through User
          },
        },
      },
    });

    // 5. Send successful response
    res.status(200).json({
      success: true,
      data: reqdata,
      meta: {
        count: reqdata.length,
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

export const updatePlayerRegDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, regDate, expDate } = req.body;

    // Validate input
    if (!id || !regDate || !expDate) {
      res.status(405).json({
        success: false,
        message: "Missing required fields: id, regDate or expDate",
      });
      return;
    }

    // Update regDate and expDate for the player
    const updatedPlayer = await prisma.player.update({
      where: { id: parseInt(id) },
      data: {
        regDate: new Date(regDate),
        regExpDate: new Date(expDate),
      },
    });

    res.status(200).json({
      success: true,
      message: "Player dates updated successfully.",
      data: updatedPlayer,
    });
  } catch (error) {
    console.error("Error updating player dates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//-------------------------------------

export const getAllCloseclubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.closeclubs.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getAllOpenclubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.openclubs.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getAllMercclubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.mercantileclubs.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getAllSchools = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.schools.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getAllUniversities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.universities.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getAllAssociations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Optional query params for sorting
    const { sortBy = "name", sortOrder = "asc" } = req.query;

    // Validate sort order
    const validSortOrders = ["asc", "desc"];
    const validatedSortOrder = validSortOrders.includes(sortOrder as string)
      ? (sortOrder as "asc" | "desc")
      : "asc";

    // Fetch close clubs from database, default: order by name A–Z
    const clubs = await prisma.associations.findMany({
      orderBy: {
        [sortBy as string]: validatedSortOrder,
      },
      include: {
        openclubs: {
          orderBy: { name: "asc" },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        sortBy,
        sortOrder: validatedSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching close clubs:", error);

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

export const getOpenClubsByAssociationId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // associationId can come from params or query
    const idRaw = req.params.associationId ?? req.query.associationId;
    const associationId = Number(idRaw);

    if (!associationId || Number.isNaN(associationId)) {
      res.status(400).json({ success: false, error: "Invalid associationId" });
      return;
    }

    // Fetch clubs by associationId
    const clubs = await prisma.openclubs.findMany({
      where: { associationsId: associationId },
      orderBy: { name: "asc" }, // sort A–Z
    });

    res.status(200).json({
      success: true,
      data: clubs,
      meta: {
        count: clubs.length,
        associationId,
      },
    });
  } catch (error) {
    console.error("Error fetching open clubs:", error);

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

export const getAssociationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // associationId can come from params or query
    const idRaw = req.params.associationId ?? req.query.associationId;
    const type = req.params.type ?? req.query.type;
    const associationId = Number(idRaw);

    if (!associationId || Number.isNaN(associationId)) {
      res.status(400).json({ success: false, error: "Invalid associationId" });
      return;
    }

    let association;

    // Determine which model to use based on type
    if (type === "open") {
      association = await prisma.associations.findUnique({
        where: { id: associationId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else if (type === "close") {
      association = await prisma.closeclubs.findUnique({
        where: { id: associationId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else {
      res.status(400).json({ success: false, error: "Invalid type" });
      return;
    }

    if (!association) {
      res.status(404).json({
        success: false,
        error: "Association not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: association,
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

export const getClubById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // associationId can come from params or query
    const idRaw = req.params.associationId ?? req.query.associationId;
    const type = req.params.type ?? req.query.type;
    const cId = req.params.clubId ?? req.query.clubId;
    const clubId = Number(cId);
    const associationId = Number(idRaw);

    if (!associationId || Number.isNaN(associationId)) {
      res.status(400).json({ success: false, error: "Invalid associationId" });
      return;
    }

    let association;

    // Determine which model to use based on type
    if (type === "open") {
      association = await prisma.openclubs.findUnique({
        where: { id: clubId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else if (type === "close" && associationId === 4) {
      association = await prisma.schools.findUnique({
        where: { id: clubId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else if (type === "close" && associationId === 5) {
      association = await prisma.universities.findUnique({
        where: { id: clubId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else if (type === "close" && associationId === 6) {
      association = await prisma.mercantileclubs.findUnique({
        where: { id: clubId },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });
    } else {
      res.status(400).json({ success: false, error: "Invalid type" });
      return;
    }

    if (!association) {
      res.status(404).json({
        success: false,
        error: "Association not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: association,
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

// export const getClubById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // associationId can come from params or query
//     const idRaw = req.params.clubId ?? req.query.clubId;
//     const clubId = Number(idRaw);

//     if (!clubId || Number.isNaN(clubId)) {
//       res.status(400).json({ success: false, error: "Invalid associationId" });
//       return;
//     }

//     // Fetch association by ID
//     const association = await prisma.openclubs.findUnique({
//       where: { id: clubId },
//       select: {
//         id: true,
//         name: true,
//         code: true,
//       },
//     });

//     if (!association) {
//       res.status(404).json({
//         success: false,
//         error: "Association not found",
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: association,
//     });
//   } catch (error) {
//     console.error("Error fetching association:", error);

//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       res.status(400).json({
//         success: false,
//         error: "Database error",
//         code: error.code,
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         error: "Internal server error",
//         message: (error as Error).message,
//       });
//     }
//   }
// };
export const signUpAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      district,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        firstName,
        lastName,
        nicNum,
        contact,
        dateofBirth: new Date(dateofBirth),
        gender,
        role: "admin",
        status: "active",
        district,
      },
    });
    console.log("Creating player profile for user:", newUser.id);

    res.status(201).json({ success: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create account.",
      details: error instanceof Error ? error.message : error,
    });
  }
};
export const getAlladmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // --- Parse & normalize query params
    const { sortBy: sortByRaw, sortOrder: sortOrderRaw } = req.query as {
      sortBy?: string;
      sortOrder?: string;
    };

    // Allowed fields on User you can safely sort by
    const ALLOWED_SORT_FIELDS = new Set([
      "id",
      "email",
      "fullName",
      "firstName",
      "lastName",
      "nicNum",
      "contact",
      "dateofBirth",
      "gender",
      "role",
      "status",
      "district",
      "profilePictureName",
      "createdAt",
    ]);

    // Default and normalization
    const sortOrder: Prisma.SortOrder =
      sortOrderRaw?.toLowerCase() === "desc" ? "desc" : "asc";

    const sortBy = sortByRaw ?? "firstName"; // <-- default to a real column

    // Build orderBy (support "name" alias → firstName, lastName)
    let orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];

    if (sortBy === "name") {
      // map "name" to a two-level sort
      orderBy = [{ firstName: sortOrder }, { lastName: sortOrder }];
    } else if (ALLOWED_SORT_FIELDS.has(sortBy)) {
      orderBy = { [sortBy]: sortOrder } as Prisma.UserOrderByWithRelationInput;
    } else {
      // fallback if an invalid field is provided
      orderBy = { createdAt: "asc" };
    }

    // Query
    const admins = await prisma.user.findMany({
      where: { role: "admin" }, // ensure this matches your Role enum/string values
      orderBy,
      // select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true } // (optional) avoid exposing sensitive fields
    });

    res.status(200).json({
      success: true,
      data: admins,
      meta: {
        count: admins.length,
        sortBy,
        sortOrder,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching admin:", error);

    // Prisma v4+: use Prisma.PrismaClientKnownRequestError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({
        success: false,
        error: "Database error",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Validation errors (e.g., malformed orderBy) → 400
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const getNotRegisteredPlayerCount = async (
  req: Request,
  res: Response
) => {
  try {
    const now = new Date(); // UTC "now"

    const count = await prisma.player.count({
      where: {
        // ensure only users with role = 'player'
        user: { role: "player" },
        // not registered if never registered OR registration expired
        OR: [
          { regDate: null },
          { regExpDate: { lt: now } }, // if regExpDate is null, this won't match (good)
        ],
      },
    });

    res.status(200).json({ success: true, message: "OK", data: { count } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get count" });
  }
};

export const getAllPlayers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // --- Parse & normalize query params
    const { sortBy: sortByRaw, sortOrder: sortOrderRaw } = req.query as {
      sortBy?: string;
      sortOrder?: string;
    };

    const sortOrder: Prisma.SortOrder =
      sortOrderRaw?.toLowerCase() === "desc" ? "desc" : "asc";

    const sortBy = (sortByRaw ?? "firstName").trim();

    // Allowed user fields to sort by
    const ALLOWED_USER_SORT_FIELDS = new Set([
      "id",
      "email",
      "fullName",
      "firstName",
      "lastName",
      "nicNum",
      "contact",
      "dateofBirth",
      "gender",
      "role",
      "status",
      "district",
      "profilePictureName",
      "createdAt",
    ]);

    // Allowed player fields
    const ALLOWED_PLAYER_SORT_FIELDS = new Set([
      "player.regDate",
      "player.regExpDate",
      "player.createdAt",
      "player.updatedAt",
    ]);

    // Allowed relation code sorts (only these two relations)
    const ALLOWED_PLAYER_REL_CODE_SORTS = new Set([
      "player.openAssociation.code",
      "player.closeAssociation.code",
    ]);

    // Build orderBy
    let orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];

    if (sortBy === "name") {
      orderBy = [{ firstName: sortOrder }, { lastName: sortOrder }];
    } else if (ALLOWED_USER_SORT_FIELDS.has(sortBy)) {
      orderBy = { [sortBy]: sortOrder } as Prisma.UserOrderByWithRelationInput;
    } else if (ALLOWED_PLAYER_SORT_FIELDS.has(sortBy)) {
      const [, fld] = sortBy.split("."); // e.g., "player.regDate" -> "regDate"
      orderBy = {
        player: {
          [fld as keyof Prisma.PlayerOrderByWithRelationInput]: sortOrder,
        },
      };
    } else if (ALLOWED_PLAYER_REL_CODE_SORTS.has(sortBy)) {
      const [, relation, field] = sortBy.split("."); // ["player","openAssociation","code"]
      orderBy = {
        player: {
          [relation as "openAssociation" | "closeAssociation"]: {
            [field]: sortOrder,
          },
        },
      } as Prisma.UserOrderByWithRelationInput;
    } else {
      orderBy = { createdAt: "asc" };
    }

    // Primary query: all users with role=player + basic player & associations
    const rawPlayers = await prisma.user.findMany({
      where: { role: "player" },
      orderBy,
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
        player: {
          select: {
            id: true,
            userId: true,
            slbfId: true,
            weight: true,
            height: true,
            idType: true,
            idFrontImage: true,
            idBackImage: true,
            openAssId: true,
            closeAssId: true,
            closeClubId: true,
            openClubId: true,
            closeClubChagngeDate: true,
            openClubChagngeDate: true,
            regDate: true,
            regExpDate: true,
            createdAt: true,
            updatedAt: true,
            openAssociation: { select: { id: true, name: true, code: true } },
            closeAssociation: { select: { id: true, name: true, code: true } },
          },
        },
      },
    });

    // ---- Batch collect IDs for supplemental lookups (avoid N+1)
    const openClubIds = new Set<number>();
    const schoolIds = new Set<number>();
    const universityIds = new Set<number>();
    const mercantileIds = new Set<number>();

    for (const u of rawPlayers) {
      const p = u.player;
      if (!p) continue;

      if (p.openClubId) openClubIds.add(p.openClubId);

      if (p.closeClubId && p.closeAssId) {
        switch (p.closeAssId) {
          case 4:
            schoolIds.add(p.closeClubId);
            break;
          case 5:
            universityIds.add(p.closeClubId);
            break;
          case 6:
            mercantileIds.add(p.closeClubId);
            break;
          default:
            // 1,2,3,7 -> null; do nothing
            break;
        }
      }
    }

    // ---- Run batched lookups
    const [openClubs, schools, universities, mercantiles] = await Promise.all([
      openClubIds.size
        ? prisma.openclubs.findMany({
            where: { id: { in: [...openClubIds] } },
            select: { id: true, name: true, code: true },
          })
        : Promise.resolve([]),
      schoolIds.size
        ? prisma.schools.findMany({
            where: { id: { in: [...schoolIds] } },
            select: { id: true, name: true, code: true },
          })
        : Promise.resolve([]),
      universityIds.size
        ? prisma.universities.findMany({
            where: { id: { in: [...universityIds] } },
            select: { id: true, name: true, code: true },
          })
        : Promise.resolve([]),
      mercantileIds.size
        ? prisma.mercantileclubs.findMany({
            where: { id: { in: [...mercantileIds] } },
            select: { id: true, name: true, code: true },
          })
        : Promise.resolve([]),
    ]);

    // Build quick maps
    const openClubMap = new Map(openClubs.map((c) => [c.id, c]));
    const schoolMap = new Map(schools.map((c) => [c.id, c]));
    const universityMap = new Map(universities.map((c) => [c.id, c]));
    const mercantileMap = new Map(mercantiles.map((c) => [c.id, c]));

    // ---- Shape final payload with openClub + conditional closeClub
    const players = rawPlayers.map((u) => {
      const p = u.player;
      if (!p) return u; // unlikely, but keep original

      // openClub
      const openClub =
        p.openClubId != null ? openClubMap.get(p.openClubId) ?? null : null;

      // closeClub (conditional)
      let closeClub: { id: number; name: string; code: string } | null = null;
      if (p.closeAssId && p.closeClubId) {
        if ([1, 2, 3, 7].includes(p.closeAssId)) {
          closeClub = null;
        } else if (p.closeAssId === 4) {
          closeClub = schoolMap.get(p.closeClubId) ?? null;
        } else if (p.closeAssId === 5) {
          closeClub = universityMap.get(p.closeClubId) ?? null;
        } else if (p.closeAssId === 6) {
          closeClub = mercantileMap.get(p.closeClubId) ?? null;
        }
      }

      // return a plain object with added fields
      return {
        ...u,
        player: {
          ...p,
          openClub,  // {id,name,code} | null
          closeClub, // {id,name,code} | null
        },
      };
    });

    res.status(200).json({
      success: true,
      data: players,
      meta: {
        count: players.length,
        sortBy,
        sortOrder,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching players:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({
        success: false,
        error: "Database error",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};


export const getApprovedClubchangesByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ success: false, message: "Invalid userId" });
      return;
    }

    const data = await prisma.clubchange.findMany({
      where: { userId, status: "approved" },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      success: true,
      message: "Approved clubchange records fetched successfully.",
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("getApprovedClubchangesByUserParam error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//========================================================================================================

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



// export const updateDetails = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { herotitle, herosubtitle, imageName, openclubchangeperiodMonths, userId } = req.body;
//     console.log("befor",userId);
//     // Disallow changing author (userId) by default
//     // if (userId !== undefined) {
//     //   res.status(400).json({
//     //     success: false,
//     //     message: "Changing author (userId) is not allowed",
//     //   });
//     //   return;
//     // }

//     // Build partial update payload
//     const changes = pruneUndefined({
//       herotitle: herotitle !== undefined ? String(herotitle).trim() : undefined,
//       // if subtitle provided as empty string, set null to clear it
//       herosubtitle:
//         herosubtitle !== undefined
//           ? (String(herosubtitle).trim() === "" ? null : String(herosubtitle).trim())
//           : undefined,
//       imageName: imageName !== undefined ? String(imageName).trim() : undefined,
//       openclubchangeperiodMonths:openclubchangeperiodMonths !== undefined ? String(openclubchangeperiodMonths).trim() : undefined,
//       userId:userId
//       // userId intentionally omitted
//     });

//     console.log("befor",changes);

//     // If nothing to update, return current record
//     if (Object.keys(changes).length === 0) {
//       const existing = await prisma.setting.findUnique({
//         where: { id : 1 },
//         // include: { user: { select: SAFE_USER_SELECT } },
//       });
//       if (!existing) {
//         res.status(404).json({ success: false, message: "Details not found" });
//         return;
//       }
//       res.status(200).json({
//         success: true,
//         message: "No changes applied",
//         data: existing,
//       });
//       return;
//     }

//     const updated = await prisma.setting.update({
//       where: { id: 1 },
//       data: changes,
//       // include: { user: { select: SAFE_USER_SELECT } },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Post updated successfully",
//       data: updated,
//     });
//   } catch (error: any) {
//     if (error?.code === "P2025") {
//       res.status(404).json({ success: false, message: "Details set not found" });
//       return;
//     }
//     console.error("Error updating Details:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


export const updateDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { herotitle, herosubtitle, imageName, openclubchangeperiodMonths, userId } = req.body;

    // 1. Prepare the changes (Pruning undefined values)
    const changes = pruneUndefined({
      herotitle: herotitle !== undefined ? String(herotitle).trim() : undefined,
      herosubtitle:
        herosubtitle !== undefined
          ? (String(herosubtitle).trim() === "" ? null : String(herosubtitle).trim())
          : undefined,
      imageName: imageName !== undefined ? String(imageName).trim() : undefined,
      openclubchangeperiodMonths: 
        openclubchangeperiodMonths !== undefined 
          ? Number(openclubchangeperiodMonths) 
          : undefined,
      
      // ADDED: userId is now part of the update data
      userId: userId !== undefined ? Number(userId) : undefined,
      updatedAt: new Date(),
    });

    if (Object.keys(changes).length === 0) {
      res.status(200).json({ success: true, message: "No changes applied" });
      return;
    }

    // 2. Update record ID = 1 and change the associated userId
    const updated = await prisma.setting.upsert({
      where: { 
        id: 1 
      },
      update: changes, // This now includes the new userId
      create: {
        id: 1,
        herotitle: String(herotitle || ""),
        herosubtitle: String(herosubtitle || ""),
        imageName: String(imageName || ""),
        openclubchangeperiodMonths: Number(openclubchangeperiodMonths || 1),
        userId: Number(userId || 0) ,// Default or provided userId for creation
        updatedAt: new Date(),
      }
    });

    res.status(200).json({
      success: true,
      message: "Settings and User ID updated successfully",
      data: updated,
    });

  } catch (error: any) {
    console.error("Error updating Details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



