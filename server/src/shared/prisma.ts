import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../config";

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: config.DATABASE_URL || config.DIRECT_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,  // ✅ Pass adapter instead of URL
     log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
})

// export const prisma = new PrismaClient({
//   log: [
//     {
//       emit: "event",
//       level: "query",
//     },
//     {
//       emit: "event",
//       level: "error",
//     },
//     {
//       emit: "event",
//       level: "info",
//     },
//     {
//       emit: "event",
//       level: "warn",
//     },
//   ],
// });

// prisma.$on("query", (e) => {
//   console.log("-------------------------------------------");
//   console.log("Query: " + e.query);
//   console.log("-------------------------------------------");
//   console.log("Params: " + e.params);
//   console.log("-------------------------------------------");
//   console.log("Duration: " + e.duration + "ms");
//   console.log("-------------------------------------------");
// });

// prisma.$on('warn', (e) => {
//     console.log(e)
// })

// prisma.$on('info', (e) => {
//     console.log(e)
// })

// prisma.$on('error', (e) => {
//     console.log(e)
// })
