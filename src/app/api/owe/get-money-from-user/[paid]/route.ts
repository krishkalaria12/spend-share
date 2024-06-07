import { connect } from "@/lib/db";
import { Owe } from "@/models/owe.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const paid = request.url.split("get-money-from-user/")[1];
        const isPaid = paid === "paid"; // Convert string to boolean

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return Response.json(createError("Invalid user ID", 400, false));
        }
    
        const pipeline = [
            {
                $match: {
                    creditor: userId,
                    paid: isPaid,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "debtor",
                    foreignField: "_id",
                    as: "debtorInfo",
                },
            },
            {
                $unwind: "$debtorInfo",
            },
            {
                $project: {
                    _id: 0,
                    debtor: 0,
                    creditor: 0,
                    createdAt: 0,
                    updatedAt: 0,
                },
            },
        ];
    
        const moneyOwedToUser = await Owe.aggregate(pipeline);
    
        if (!moneyOwedToUser) {
            return Response.json(createError("No money owed to user", 404, false));
        }
    
        return Response.json(createResponse(
            "Money owed to user found successfully", 200, true, moneyOwedToUser
        ));
    } catch (error) {
        console.log(error);
        return Response.json(createError("Internal server error", 500, false));
    }
}