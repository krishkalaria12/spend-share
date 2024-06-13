import { connect } from "@/lib/db";
import Feedback from "@/models/feedback.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";

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

    if (!mongoId) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    const feedbacks = await Feedback.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$ownerDetails", 0] },
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { feedbackId: "$_id", userId: mongoId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$feedback", "$feedbackId"] },
                    { $eq: ["$likedBy", "$userId"] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "likedByUser",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          message: 1,
          "owner.username": 1,
          "owner.fullName": 1,
          "owner.avatar": 1,
          "owner.clerkId": 1,
          isLiked: { $gt: [{ $size: "$likedByUser" }, 0] },
        },
      },
    ]);

    const totalFeedbacks = await Feedback.countDocuments();

    const response = {
      feedbacks,
      totalPages: Math.ceil(totalFeedbacks / limit),
      currentPage: page,
    };

    return new Response(
      JSON.stringify(createResponse("Feedbacks fetched successfully", 200, true, response)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return new Response(
      JSON.stringify(createError("Something went wrong!", 500, false, error)),
      { status: 500 }
    );
  }
}
