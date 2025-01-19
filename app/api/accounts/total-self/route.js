import { getAuthToken } from "@/lib/common/token";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function GET(req) {
  try {
     const token = await getAuthToken();
   
     if (!token) {
       return new Response(JSON.stringify({ error: "Unauthorized" }), {
         status: 401,
       });
     }

    const decoded = jwt.verify(token, JWT_SECRET);
    const customerId = decoded.customerId;

    const totalAccounts = await prisma.account.count({
      where: {
        customerId
      },
    });

    return new Response(JSON.stringify({ total: totalAccounts }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching total accounts:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
}
