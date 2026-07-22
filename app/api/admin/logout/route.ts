import { ADMIN_COOKIE } from "../../../static-admin-auth";

function logout(request: Request) {
  const response = Response.redirect(new URL("/", request.url), 303);
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
  return response;
}

export const GET = logout;
export const POST = logout;
