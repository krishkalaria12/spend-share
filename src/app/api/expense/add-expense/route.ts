import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {

    await connect();

    try {
        const { category, amount,title, description } = await request.json();

        const { has, sessionClaims } = auth();

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!(category || amount || title)) {
            return Response.json(createError("All fields are required", 401, false));
        }

        if (parseInt(amount) <= 0) {
            return Response.json(createError("Amount must be greater than 0", 401, false));
        }

        if (description && description.length > 200) {
            return Response.json(createError("Description must be less than 200 characters", 401, false));
        }

        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        const expense = await Expense.create({
            owner: mongoId,
            category,
            amount,
            description,
            title
        })

        if (!expense) {
            return Response.json(
                createError(
                    "Error Submitting Expense", 500, false
                )
            );
        }

        return Response.json(
            createResponse(
                "Expense submitted successfully", 200, true, expense
            )
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            createError(
                "Internal Server Error", 200, false, error
            )
        );
    }
}