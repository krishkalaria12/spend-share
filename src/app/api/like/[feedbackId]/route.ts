import { connect } from "@/lib/db";
import { Like } from "@/models/like.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const feedbackId = request.url.split("like/")[1];
        
        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!userId || !mongoose.isValidObjectId(userId) || !feedbackId || !mongoose.isValidObjectId(feedbackId)) {
            throw createError("Invalid request", 400, false);
        }

        const likedAlready = await Like.findOne({
            feedback: feedbackId,
            likedBy: userId,
        });

        if (likedAlready) {
            await Like.findByIdAndDelete(likedAlready._id)
    
            return Response.json(createResponse("Liked successfully", 200, true, { isLiked: false }));
        }
        
        await Like.create({
            feedback: feedbackId,
            likedBy: userId,
        });
    
        return Response.json(createResponse("Liked successfully", 200, true, { isLiked: true }));

    } catch (error) {
        console.error(error);
        throw createError("Something went wrong!", 500, false, error);
    }
}