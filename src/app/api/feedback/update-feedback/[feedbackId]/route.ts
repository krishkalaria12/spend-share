import Feedback from "@/models/feedback.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, request: Request) {

    const feedbackId = request.url.split("update-feedback/")[1];
    const { message } = await request.json();

    const { has, sessionClaims } = auth();

    if (!has) {
        throw createError("Unauthorised", 401, false);
    }

    if (!isValidObjectId(feedbackId)) {
        throw createError("Feedback not found", 404, false);
    }

    if (!message) {
        throw createError("Message is Required", 404, false);
    }

    const feedbackDetails = await Feedback.findById(feedbackId);

    if (!feedbackDetails) {
        throw createError("Feedback not found", 404, false);
    }

    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!mongoId) {
        throw createError(
            "Unauthorized", 401, false
        )
    }

    const id = new mongoose.Types.ObjectId(mongoId);

    if (
        !id || !id.equals(feedbackDetails.owner)
    ) {
        throw createError("You are not authorized to update this feedback", 200, true)
    }

    const feedback = await Feedback.findByIdAndUpdate(
        feedbackDetails?._id,
        {
        $set: {
            message,
        },
        },
        { new: true }
    );

    if (!feedback) {
        throw createError("Failed to update feedback! Try again later", 400, false);
    }

    return Response.json(
        createResponse("Feedback Updated successfully", 200, true, feedback)
    );
}
