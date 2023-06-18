import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'info', 'warn'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// let prisma: PrismaClient;
// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else if (process.env.NODE_ENV === 'development') {
//   prisma = new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'info', 'warn'] : [],
//   });
// } else {
//   if (!global.cachedPrisma) {
//     global.cachedPrisma = new PrismaClient();
//   }
//   prisma = global.cachedPrisma;
// }

// export default prisma;

// export * from '@prisma/client';
