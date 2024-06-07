import { connect } from "@/lib/db";
import { Owe } from "@/models/owe.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const paid = request.url.split("get-owes-to-users/")[1];
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
                    debtor: userId,
                    paid: isPaid,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "creditor",
                    foreignField: "_id",
                    as: "creditorInfo",
                },
            },
            {
                $unwind: "$creditorInfo",
            },
            {
                $project: {
                    _id: 0,
                    debtor: 0,
                    creditor: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "creditorInfo.password": 0,
                    "creditorInfo.refreshToken": 0,
                },
            },
        ];
    
        // Execute the aggregation pipeline
        const owesToUser = await Owe.aggregate(pipeline);
    
        if (!owesToUser) {
            return Response.json(createError("No owes found", 404, false));
        }
    
        return Response.json(createResponse(
            "Owes found successfully", 200, true, owesToUser
        ));
    } catch (error) {
        console.log(error);
        return Response.json(createError("Internal server error", 500, false));
    }
}