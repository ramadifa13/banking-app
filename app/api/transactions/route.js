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

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);

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
                OR: [
                    { fromAccountId: { in: accountIds } },
                    { toAccountId: { in: accountIds } }
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
                OR: [
                    { fromAccountId: { in: accountIds } },
                    { toAccountId: { in: accountIds } }
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
        console.error("Error fetching transactions:", error);
        return new Response(JSON.stringify({ error: "Error fetching transactions" }), {
            status: 500,
        });
    }
}

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

        const { transactionType, amount, fromAccountId, toAccountId } = await req.json();
        
        if (!transactionType || !amount || !fromAccountId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }
      
        if (amount <= 0) {
            return new Response(JSON.stringify({ error: "Amount must be greater than zero" }), {
                status: 400,
            });
        }
        
        if (transactionType === "Transfer" && !toAccountId) {
            return new Response(JSON.stringify({ error: "To account is required for transfers" }), {
                status: 400,
            });
        }
       
        const fromAccount = await prisma.account.findUnique({
            where: { id: fromAccountId },
        });

        if (!fromAccount || fromAccount.customerId !== customerId) {
            return new Response(JSON.stringify({ error: "Invalid from account" }), {
                status: 400,
            });
        }
       
        let toAccount = null;
        if (transactionType === "Transfer") {
            toAccount = await prisma.account.findUnique({
                where: { id: toAccountId },
            });

            if (!toAccount || toAccount.customerId === customerId) {
                return new Response(JSON.stringify({ error: "Invalid to account" }), {
                    status: 400,
                });
            }
        }
       
        if (transactionType === "Setoran") {
            await prisma.account.update({
                where: { id: fromAccountId },
                data: {
                    balance: fromAccount.balance + amount,
                },
            });
        } else if (transactionType === "Penarikan") {
            if (fromAccount.balance < amount) {
                return new Response(JSON.stringify({ error: "Insufficient funds" }), {
                    status: 400,
                });
            }

            await prisma.account.update({
                where: { id: fromAccountId },
                data: {
                    balance: fromAccount.balance - amount,
                },
            });
        } else if (transactionType === "Transfer") {
            if (fromAccount.balance < amount) {
                return new Response(JSON.stringify({ error: "Insufficient funds for transfer" }), {
                    status: 400,
                });
            }
          
            await prisma.account.update({
                where: { id: fromAccountId },
                data: {
                    balance: fromAccount.balance - amount,
                },
            });
          
            await prisma.account.update({
                where: { id: toAccountId },
                data: {
                    balance: toAccount.balance + amount,
                },
            });
        }

        const transaction = await prisma.transaction.create({
            data: {
                transactionType,
                amount,
                fromAccountId,
                toAccountId: toAccountId || null,
                transactionDate: new Date(),
                transactionStatus: "Success", 
            },
        });

        await prisma.transactionHistory.create({
            data: {
                transactionId: transaction.id,
                changedBalance: amount,
            },
        });

        return new Response(JSON.stringify({ transaction }), { status: 201 });
    } catch (error) {
        console.error("Error creating transaction:", error);
        return new Response(JSON.stringify({ error: "Error creating transaction" }), {
            status: 500,
        });
    }
}
