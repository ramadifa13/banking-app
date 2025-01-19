import prisma from "@/lib/prisma";
import { getAuthToken } from "@/lib/common/token";

export async function GET(req) {
  const token = await getAuthToken();

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const totalAccounts = await prisma.account.count();
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
