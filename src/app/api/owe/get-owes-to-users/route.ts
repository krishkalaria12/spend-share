import { connect } from "@/lib/db";
import { Owe } from "@/models/owe.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// This API route is responsible for fetching the owes that the authenticated user needs to pay to others

export async function GET(request: Request) {
  await connect();

  try {
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
          debtor: new mongoose.Types.ObjectId(userId),
          // paid: isPaid,
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
          _id: 1,
          amount: 1,
          description: 1,
          paid: 1,
          title: 1,
          category: 1,
          creditorInfo: {
            email: 1,
            fullName: 1,
            username: 1,
            avatar: 1,
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const owesToUser = await Owe.aggregate(pipeline);
    console.log(owesToUser);
    
    if (!owesToUser) {
      return Response.json(createError("No owes found", 404, false));
    }

    return Response.json(
      createResponse("Owes found successfully", 200, true, owesToUser)
    );
  } catch (error) {
    console.log(error);
    return Response.json(createError("Internal server error", 500, false));
  }
}
