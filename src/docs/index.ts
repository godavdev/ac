import Elysia from "elysia";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

export const docs = new Elysia({ prefix: "/docs" }).use(auth).get(
  ":id",
  async ({ params: { id }, status, user }) => {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        documentAccesses: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!document) {
      return status("Not Found");
    }

    if (
      user.id !== document.createdByUserId &&
      !document.documentAccesses.some((access) => access.userId === user.id)
    ) {
      return status("Forbidden");
    }

    return `Document ID: ${id}`;
  },
  { auth: true }
);
