import { ADMIN_COOKIE, expectedAdminToken, validAdminCredentials } from "../../../static-admin-auth";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as { username?: string; password?: string };
  if (!username || !password || !(await validAdminCredentials(username, password))) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=${await expectedAdminToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`);
  return response;
}
