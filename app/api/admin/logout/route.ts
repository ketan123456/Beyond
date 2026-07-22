import { ADMIN_COOKIE } from "../../../static-admin-auth";

export async function GET(request: Request) {
  const response = Response.redirect(new URL("/admin/login", request.url), 303);
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
  return response;
}
