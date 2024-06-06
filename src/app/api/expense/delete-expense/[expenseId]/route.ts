import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
    await connect();

    try {
        const expenseId = request.url.split("delete-expense/")[1];

        const { has, sessionClaims } = auth();

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!isValidObjectId(expenseId)) {
        return Response.json(createError("Expense not found", 404, false));
        }

        const expenseDetails = await Expense.findById(expenseId);

        if (!expenseDetails) {
            return Response.json(createError("Expense not found", 404, false));
        }

        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        const userId = new mongoose.Types.ObjectId(mongoId);

        if (!userId.equals(expenseDetails?.owner)) {
            return Response.json(
                createError(
                    "You are not authorized to delete this expense", 200, true
                )
            );
        }

        const expense = await Expense.findByIdAndDelete(expenseDetails?._id);

        if (!expense) {
            return Response.json(
                createError(
                    "Failed to delete expense! Try again later", 400, false
                )
            );
        }

        return Response.json(
            createResponse(
                "Expense Deleted Successfully", 200, true, expense
            )
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            createError(
                "Internal Server Error", 500, false, error
            )
        );
    }
}
