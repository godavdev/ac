import Elysia from "elysia";
import { auth as betterAuth } from "../lib/auth";

export const auth = new Elysia({ name: "auth" })
  .mount("/auth", betterAuth.handler)
  .macro("auth", {
    async resolve({ status, request: { headers } }) {
      const session = await betterAuth.api.getSession({
        headers,
      });
      if (!session) {
        return status("Unauthorized");
      }
      return {
        user: session.user,
        session: session.session,
      };
    },
  })
  .macro("userOnly", {
    auth: true,
    resolve({ status, user }) {
      if (user.role !== "user") {
        return status("Forbidden");
      }
      return {};
    },
  })
  .macro("adminOnly", {
    auth: true,
    resolve({ status, user }) {
      if (user.role !== "admin") {
        return status("Forbidden");
      }
      return {};
    },
  })
  .macro("itOnly", {
    auth: true,
    resolve({ status, user }) {
      if (user.department !== "it") {
        return status("Forbidden");
      }
      return {};
    },
  });
