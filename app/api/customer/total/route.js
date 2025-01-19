import { getAuthToken } from "@/lib/common/token";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const token = await getAuthToken();

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const totalCustomers = await prisma.customer.count();
    return new Response(JSON.stringify({ total: totalCustomers }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
}
