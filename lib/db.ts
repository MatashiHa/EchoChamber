import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
/* для релиза следует убрать строки 8 и 9 и вставить это:
export const db = new PrismaClient();

*/
