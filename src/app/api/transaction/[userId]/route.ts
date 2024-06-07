import { connect } from "@/lib/db";
import { Transaction } from "@/models/transaction.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const userId = request.url.split("transaction/")[1];

        if (!userId) {
            return Response.json(createError("Missing user ID", 400, false));
        }

        const { has, sessionClaims } = auth();

        const requestedUser = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!requestedUser) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!mongoose.isValidObjectId(userId)) {
            return Response.json(createError("Invalid user ID", 400, false));
        }

        const currentUser = new mongoose.Types.ObjectId(userId);

        // Use aggregation pipeline to differentiate between group and individual transactions
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        { creditor: currentUser },
                        { debtor: currentUser }
                    ]
                }
            },
            {
                $addFields: {
                    isGroupTransaction: {
                        $cond: {
                            if: { $ne: ["$groupId", null] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$isGroupTransaction",
                    transactions: { $push: "$$ROOT" }
                }
            }
        ]);

        // Extract group and individual transactions from the aggregation result
        const groupTransactions = transactions.find(t => t._id === true)?.transactions || [];
        const individualTransactions = transactions.find(t => t._id === false)?.transactions || [];

        return Response.json(createResponse(
            "Transactions found successfully", 200, true, {
            groupTransactions,
            individualTransactions
        }));
    } catch (error) {
        console.log(error);
        return Response.json(createError("Internal server error", 500, false));
    }
}