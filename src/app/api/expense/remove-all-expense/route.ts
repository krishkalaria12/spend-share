import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(request: Request) {
    await connect();

    try {
        const { has, sessionClaims } = auth();
        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has || !mongoId) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        // Delete all expenses where the owner's mongoId matches
        const deleteResult = await Expense.deleteMany({ owner: mongoId });

        if (deleteResult.deletedCount === 0) {
            return Response.json(
                createError(
                    "No expenses found to delete", 404, false
                )
            );
        }

        return Response.json(
            createResponse(
                "All Expenses Deleted Successfully", 200, true
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

