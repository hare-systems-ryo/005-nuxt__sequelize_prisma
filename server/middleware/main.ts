import { PrismaClient } from '@prisma/client';

export default defineEventHandler((event) => {
  const url = String(event.node.req.url);
  console.log('Request:', url);
  // Prisma用 Bigint 変換失敗の対策
  (BigInt as any).prototype.toJSON = function () {
    return this.toString();
  };
});
