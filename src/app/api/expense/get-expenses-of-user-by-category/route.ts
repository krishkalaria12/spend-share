import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {

        const { has, sessionClaims } = auth();

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!isValidObjectId(mongoId)) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        const pipeline: any[] = [];

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(mongoId),
            },
        });

        pipeline.push({ $sort: { createdAt: -1 } });

        pipeline.push(
            {
                $group: {
                _id: "$category",
                totalExpense: { $sum: "$amount" },
                expenses: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                _id: 0,
                category: "$_id",
                totalExpense: 1,
                expenses: 1,
                },
            }
        );

        const expense = await Expense.aggregate(pipeline);

        if (!expense) {
            return Response.json(
                createError(
                    "Error fetching expenses", 500, false
                )
            );
        }

        return Response.json(
            createResponse(
                "Expenses fetched successfully", 200, true, expense
            )
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            createError("Internal Server Error", 200, false, error)
        );
    }
}
