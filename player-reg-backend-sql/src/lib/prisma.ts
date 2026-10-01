// Single shared Prisma client for the whole app.
// Avoids each controller opening its own connection pool.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
