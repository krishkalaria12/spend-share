import { connect } from "@/lib/db";
import { Transaction } from "@/models/transaction.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("group-transactions/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!userId || !mongoose.isValidObjectId(userId) || !groupId || !mongoose.isValidObjectId(groupId)) {
            throw createError("Invalid user ID or group ID", 400, false);
        }

        const transactions = await Transaction.aggregate([
            {
                $match: {
                    groupId: new mongoose.Types.ObjectId(groupId)
                }
            },
            {
                $lookup: {
                    from: "owes",
                    localField: "_id",
                    foreignField: "transactionId",
                    as: "owes",
                }
            },
            {
                $unwind: "$owes"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owes.creditor",
                    foreignField: "_id",
                    as: "creditorInfo"
                }
            },
            {
                $unwind: "$creditorInfo"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owes.debtor",
                    foreignField: "_id",
                    as: "debtorInfo"
                }
            },
            {
                $unwind: "$debtorInfo"
            },
            {
                $group: {
                    _id: "$_id",
                    totalAmount: { $first: "$amount" },
                    description: { $first: "$description" },
                    title: { $first: "$title" },
                    category: { $first: "$category" },
                    createdAt: { $first: "$createdAt" },
                    creditor: { 
                        $first: {
                            fullName: "$creditorInfo.fullName",
                            email: "$creditorInfo.email",
                            username: "$creditorInfo.username",
                            avatar: "$creditorInfo.avatar"
                        }
                    },
                    owes: {
                        $push: {
                            _id: "$owes._id", // Include owe ID
                            debtor: {
                                fullName: "$debtorInfo.fullName",
                                email: "$debtorInfo.email",
                                username: "$debtorInfo.username",
                                avatar: "$debtorInfo.avatar",
                                clerkId: "$debtorInfo.clerkId"
                            },
                            paid: "$owes.paid",
                            amount: "$owes.amount" // Include amount in the owes object
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    description: 1,
                    title: 1,
                    category: 1,
                    createdAt: 1,
                    creditor: 1,
                    owes: 1
                }
            }
        ]);

        if (!transactions) {
            throw createError(
                "No transactions found", 404, false
            );
        }

        return Response.json(
            createResponse(
                "Successfully fetched group transactions",
                200,
                true,
                transactions
            )
        );
    } catch (error) {
        console.error("Error while fetching group transactions:", error);
        throw createError(
            "Error while fetching group transactions", 500, false
        );
    }
}
