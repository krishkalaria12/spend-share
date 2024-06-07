import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { Transaction } from "@/models/transaction.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("group-transactions/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!userId || !mongoose.isValidObjectId(userId) || !groupId || !mongoose.isValidObjectId(groupId)) {
            return Response.json(createError("Invalid user ID or group ID", 400, false));
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
                    pipeline: [
                        {
                            $match: {
                                debtor: userId
                            }
                        },
                        {
                            $project: {
                                amount: 1,
                                paid: 1,
                                creditor: 1,
                            }
                        }
                    ]
                }
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
                $project: {
                    _id: 1,
                    totalAmount: "$amount",
                    amount: { $arrayElemAt: ["$owes.amount", 0] },
                    paid: { $arrayElemAt: ["$owes.paid", 0] },
                    creditor: {
                        $arrayElemAt: ["$creditorInfo", 0]
                    },
                    description: 1,
                    title: 1,
                    category: 1,
                    createdAt: 1,
                }
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    amount: 1,
                    paid: 1,
                    creditor: {
                        fullname: "$creditor.fullname",
                        email: "$creditor.email",
                        username: "$creditor.username",
                        avatar: "$creditor.avatar"
                    },
                    description: 1,
                    title: 1,
                    category: 1,
                    createdAt: 1,
                }
            }
        ]);

        if (!transactions) {
            return Response.json(
                createError(
                    "No transactions found", 404, false
                )
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
        return Response.json(
            createError(
                "Error while fetching group transactions", 500, false
            )
        );
    }
}