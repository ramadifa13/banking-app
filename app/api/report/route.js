
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

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
        const startDate = req.nextUrl.searchParams.get('startDate');
        const endDate = req.nextUrl.searchParams.get('endDate');

        if (page <= 0 || limit <= 0) {
            return new Response(
                JSON.stringify({ error: "Invalid page or limit values" }),
                { status: 400 }
            );
        }

        const accounts = await prisma.account.findMany({
            where: { customerId },
            select: { id: true },
        });

        const accountIds = accounts.map(account => account.id);

        const transactions = await prisma.transaction.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAccountId: { in: accountIds } },
                            { toAccountId: { in: accountIds } }
                        ]
                    },
                    startDate ? { transactionDate: { gte: new Date(startDate) } } : {},
                    endDate ? { transactionDate: { lte: new Date(endDate) } } : {}
                ]
            },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                fromAccount: {
                    select: { accountNumber: true }
                },
                toAccount: {
                    select: { accountNumber: true }
                }
            }
        });

        const total = await prisma.transaction.count({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAccountId: { in: accountIds } },
                            { toAccountId: { in: accountIds } }
                        ]
                    },
                    startDate ? { transactionDate: { gte: new Date(startDate) } } : {},
                    endDate ? { transactionDate: { lte: new Date(endDate) } } : {}
                ]
            },
        });

        const transactionsWithAccountNames = transactions.map(transaction => ({
            ...transaction,
            fromAccountName: transaction.fromAccount ? transaction.fromAccount.accountNumber : null,
            toAccountName: transaction.toAccount ? transaction.toAccount.accountNumber : null
        }));

        return new Response(JSON.stringify({ transactions: transactionsWithAccountNames, total }), { status: 200 });
    } catch (error) {
        console.error("Error fetching report:", error);
        return new Response(JSON.stringify({ error: "Error fetching report" }), {
            status: 500,
        });
    }
}
