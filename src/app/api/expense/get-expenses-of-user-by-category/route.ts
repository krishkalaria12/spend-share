import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  await connect();

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const { has, sessionClaims } = auth();

    if (!has) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!isValidObjectId(mongoId)) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    const pipeline: any[] = [
      {
        $match: {
          owner: new mongoose.Types.ObjectId(mongoId),
        },
      },
      { $sort: { createdAt: -1 } },
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
          expenses: { $slice: ["$expenses", skip, limit] },
        },
      },
    ];

    const expense = await Expense.aggregate(pipeline);
    const totalExpenses = await Expense.countDocuments({
      owner: new mongoose.Types.ObjectId(mongoId),
    });

    if (!expense) {
      return new Response(
        JSON.stringify(createError("Error fetching expenses", 500, false)),
        { status: 500 }
      );
    }

    const response = {
      expenses: expense,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: page,
    };

    return new Response(
      JSON.stringify(createResponse("Expenses fetched successfully", 200, true, response)),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify(createError("Internal Server Error", 500, false, error)),
      { status: 500 }
    );
  }
}
