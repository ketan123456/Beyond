import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "../../../static-admin-auth";

function logout(request: Request) {
  const response = request.method === "POST"
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: new URL(request.url).protocol === "https:",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}

export const GET = logout;
export const POST = logout;
