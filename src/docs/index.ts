import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

export const docs = new Elysia({ prefix: "/docs" })
  .use(auth)
  .get(
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

      return `${document.title} - ${document.content}`;
    },
    { auth: true, params: t.Object({ id: t.String({ format: "uuid" }) }) }
  )
  .post(
    ":id",
    async ({ params: { id }, status, user, body }) => {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          documentAccesses: {
            select: {
              userId: true,
              accessLevel: true,
            },
          },
        },
      });

      if (!document) {
        return status("Not Found");
      }

      if (
        user.id !== document.createdByUserId &&
        !document.documentAccesses.some(
          (access) =>
            access.userId === user.id && access.accessLevel === "WRITE"
        )
      ) {
        return status("Forbidden");
      }

      const updatedDocument = await prisma.document.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
        },
      });
      return `${updatedDocument.title} - ${updatedDocument.content}`;
    },
    {
      auth: true,
      body: t.Object({ title: t.String(), content: t.String() }),
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    }
  );
