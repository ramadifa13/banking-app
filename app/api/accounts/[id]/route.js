import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getAuthToken } from "@/lib/common/token";

export async function GET(req, { params }) {
    const { id } = await params;
  
  try {
    const token = await getAuthToken(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }
    const customerId = decoded.customerId;

    const account = await prisma.account.findUnique({
      where: {
        id: parseInt(id), 
        customerId, 
      },
      include: {
        customer: {
          select: {
            name: true
          }
        }
      }
    });

    if (!account) {
      return new Response(JSON.stringify({ error: "Account not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ account }), { status: 200 });
  } catch (error) {
    console.error("Error fetching account:", error);
    return new Response(JSON.stringify({ error: "Error fetching account" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params; 

  try {
    const token = await getAuthToken(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }
    const customerId = decoded.customerId;

    const { accountType, balance } = await req.json();

    if (!accountType || balance === undefined) {
      return new Response(
        JSON.stringify({ error: "Account type and balance are required" }),
        { status: 400 }
      );
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: parseInt(id),
        customerId, 
      },
      data: {
        accountType,
        balance: parseFloat(balance),
      },
    });

    return new Response(JSON.stringify({ account: updatedAccount }), { status: 200 });
  } catch (error) {
    console.error("Error updating account:", error);
    return new Response(JSON.stringify({ error: "Error updating account" }), {
      status: 500,
    });
  }
}
