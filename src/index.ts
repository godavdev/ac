import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "./auth";
import { docs } from "./docs";
const app = new Elysia()
  .use(cors())
  .use(auth)
  .get("/", () => "Resultado público")
  .use(docs)
  .get(
    "/authenticated",
    ({ user }) => {
      return `Hola ${user.name}! Este es un resultado autenticado.`;
    },
    { auth: true }
  )
  .get(
    "/admin",
    ({ user }) => {
      return `Hola ${user.name}! Este es un resultado para administradores.`;
    },
    { adminOnly: true }
  )
  .get(
    "/it",
    ({ user }) => {
      return `Hola ${user.name}! Este es un resultado para IT.`;
    },
    { itOnly: true }
  )
  .get(
    "/users",
    ({ user }) => {
      return `Hola ${user.name}! Este es un resultado para usuarios.`;
    },
    { userOnly: true }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
