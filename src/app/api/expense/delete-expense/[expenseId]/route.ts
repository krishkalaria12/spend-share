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
            throw createError("Unauthorized", 401, false);
        }

        if (!isValidObjectId(expenseId)) {
            throw createError("Expense not found", 404, false);
        }

        const expenseDetails = await Expense.findById(expenseId);

        if (!expenseDetails) {
            throw createError("Expense not found", 404, false);
        }

        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        const userId = new mongoose.Types.ObjectId(mongoId);

        if (!userId.equals(expenseDetails?.owner)) {
            throw createError(
                "You are not authorized to delete this expense", 200, true
            );
        }

        const expense = await Expense.findByIdAndDelete(expenseDetails?._id);

        if (!expense) {
            throw createError(
                "Failed to delete expense! Try again later", 400, false
            );
        }

        return Response.json( 
            createResponse(
                "Expense Deleted Successfully", 200, true, expense
            )
        );
    } catch (error) {
        console.error(error);
        throw createError(
            "Internal Server Error", 500, false, error
        )
    }
}
