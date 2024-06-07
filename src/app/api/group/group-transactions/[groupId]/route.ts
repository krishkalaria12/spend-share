import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { Transaction } from "@/models/transaction.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
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
                                debtor: new mongoose.Types.ObjectId(userId)
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
                $project: {
                    _id: 1,
                    totalAmount: "$amount",
                    amount: "$owes.amount",
                    paid: "$owes.paid",
                    creditor: {
                        fullName: "$creditorInfo.fullName",
                        email: "$creditorInfo.email",
                        username: "$creditorInfo.username",
                        avatar: "$creditorInfo.avatar"
                    },
                    description: 1,
                    title: 1,
                    category: 1,
                    createdAt: 1,
                }
            }
        ]);

        if (!transactions || transactions.length === 0) {
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
