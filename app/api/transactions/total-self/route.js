import { getAuthToken } from "@/lib/common/token";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    const accounts = await prisma.account.findMany({
      where: { customerId },
      select: { id: true },
    });

    const accountIds = accounts.map(account => account.id);

    const totalTransactions = await prisma.transaction.count({
      where: {
        OR: [
          { fromAccountId: { in: accountIds } },
          { toAccountId: { in: accountIds } },
        ],
      },
    });

    return new Response(JSON.stringify({ total: totalTransactions }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching total transactions:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
}
