import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getAuthToken } from "@/lib/common/token";


export async function GET(req) {
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

    const { page = 1, limit = 10, name = "" } = req.nextUrl.searchParams;

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    if (pageInt <= 0 || limitInt <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid page or limit values" }),
        { status: 400 }
      );
    }

    const where = name
      ? { customerName: { contains: name, mode: "insensitive" } }
      : {};

    const accounts = await prisma.account.findMany({
      where: { ...where, customerId },
      skip: (pageInt - 1) * limitInt,
      take: limitInt,
    });

    const total = await prisma.account.count({
      where: { ...where, customerId },
    });

    return new Response(JSON.stringify({ accounts, total }), { status: 200 });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return new Response(JSON.stringify({ error: "Error fetching accounts" }), {
      status: 500,
    });
  }
}


const generateAccountNumber = (customerId) => {
  
  const customerPrefix = customerId.toString().slice(0, 3);
  
  
  const randomSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  
  return `${customerPrefix}${randomSuffix}`;
};

export async function POST(req) {
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

    
    const accountNumber = generateAccountNumber(customerId);

    
    const newAccount = await prisma.account.create({
      data: {
        accountNumber, 
        accountType,
        balance: parseFloat(balance),
        customerId, 
      },
    });

    return new Response(JSON.stringify({ account: newAccount }), { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return new Response(JSON.stringify({ error: "Error creating account" }), {
      status: 500,
    });
  }
}
