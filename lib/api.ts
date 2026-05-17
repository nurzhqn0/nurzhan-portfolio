import { ZodError, type ZodSchema } from "zod";
import { Prisma } from "@prisma/client";

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export function jsonError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      { error: "Validation failed", fields: error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1000" || error.code === "P1001") {
      return Response.json(
        {
          error:
            "Database connection failed. Set DATABASE_URL in .env to a valid Postgres connection string, then run Prisma migrate and seed.",
        },
        { status: 503 },
      );
    }

    if (error.code === "P2021") {
      return Response.json(
        {
          error:
            "Database tables are missing. Run npm run prisma:migrate, then npm run prisma:seed.",
        },
        { status: 503 },
      );
    }
  }

  console.error(error);
  return Response.json({ error: "Unexpected server error" }, { status: 500 });
}
