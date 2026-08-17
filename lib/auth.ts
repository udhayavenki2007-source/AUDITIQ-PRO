import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "replace-me-in-production");
export type SessionUser = { id: string; role: Role; departmentId?: string | null; email: string };
export const signToken = (user: SessionUser) => new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret);
export async function requireRole(request: Request, roles: Role[]) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("UNAUTHORIZED");
  const { payload } = await jwtVerify(token, secret);
  const user = payload as unknown as SessionUser;
  if (!roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}
export function apiError(error: unknown) { const message = error instanceof Error ? error.message : "Server error"; return Response.json({ error: message }, { status: message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500 }); }
