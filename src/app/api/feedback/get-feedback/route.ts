import { connect } from "@/lib/db";
import Feedback from "@/models/feedback.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    await connect();

    try {
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
        
        const feedBack = await Feedback.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            {
                $addFields: {
                    owner: { $arrayElemAt: ["$ownerDetails", 0] }
                }
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
                                        { $eq: ["$likedBy", "$userId"] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } } // Include only _id field to check if liked
                    ],
                    as: "likedByUser"
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    message: 1,
                    "owner.username": 1,
                    "owner.fullName": 1,
                    "owner.avatar": 1,
                    "owner.clerkId": 1,
                    isLiked: { $gt: [{ $size: "$likedByUser" }, 0] } 
                }
            }
        ]);

        if (!feedBack) {
            return new Response(
                JSON.stringify(createError("No Feedbacks found", 500, false)),
                { status: 500 }
            );
        }
        
        return new Response(
            JSON.stringify(createResponse("FeedBacks fetched successfully", 200, true, feedBack)),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching feedback:", error); // Log the error for debugging
        return new Response(
            JSON.stringify(createError("Something went wrong!", 500, false, error)),
            { status: 500 }
        );
    }
}
