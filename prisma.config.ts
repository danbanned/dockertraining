import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "parisma/migrations",
  },
  // Only include datasource if DATABASE_URL exists (runtime), not during build
  ...(process.env.DATABASE_URL ? {
    datasource: {
      url: env("DATABASE_URL"),
    }
  } : {})
});