"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function saveToken({ response }) {
  const token = response.data.accessToken;
  const cookie = await cookies();
  cookie.set("token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export async function getAuthToken () {
  const cookie = await cookies();
  return cookie.get("token")?.value || ""; 
};

export async function deleteToken() {
  const cookie = await cookies();
  cookie.delete("token");
  redirect('/login')
}
