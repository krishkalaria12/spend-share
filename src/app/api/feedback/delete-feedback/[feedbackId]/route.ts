import Feedback from "@/models/feedback.models";
import { Like } from "@/models/like.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
    const feedbackId = request.url.split("delete-feedback/")[1];
    
    const { has, sessionClaims } = auth();

    if (!has) {
        throw createError("Unauthorised", 401, false);
    }

    if (!isValidObjectId(feedbackId)) {
        throw createError("Feedback not found", 404, false);
    }
    
    const feedbackDetails = await Feedback.findById(feedbackId);
    
    if (!feedbackDetails) {
        throw createError("Feedback not found", 404, false);
    }

    const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    const id = new mongoose.Types.ObjectId(userId);

    if (
        !userId || !id.equals(feedbackDetails.owner)
    ) {
        throw createError("You are not authorized to update this feedback", 200, true)
    }
    
    const feedback = await Feedback.findByIdAndDelete(feedbackDetails._id);

    if (!feedback) {
        throw createError("Error Deleting Feedback", 500, false);
    }

    await Like.deleteMany({
        feedback: feedbackId,
    });

    return Response.json(
        createResponse("Feedback Deleted successfully", 200, true)
    );
}
