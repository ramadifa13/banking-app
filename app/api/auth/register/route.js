
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      username,
      password,
      email,
      name,
      cifNumber,
      address,
      dob,
      phoneNumber,
    } = await req.json();

    if (
      !username ||
      !password ||
      !email ||
      !name ||
      !cifNumber ||
      !address ||
      !dob
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: "customer",
        customer: {
          create: {
            name,
            cifNumber,
            address,
            dob: new Date(dob),
            email,
            phoneNumber,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
