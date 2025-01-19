import { getAuthToken } from "@/lib/common/token";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
     const token = await getAuthToken();
      
        if (!token) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
          });
        }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const totalTransactions = await prisma.transaction.count({
      where: {
        OR: [
          { fromAccountId: userId },
          { toAccountId: userId },
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
