import {  NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");

  if (token) {
    if (
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (
      req.nextUrl.pathname !== "/login" &&
      req.nextUrl.pathname !== "/register"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/register",
    "/",
  ],
};