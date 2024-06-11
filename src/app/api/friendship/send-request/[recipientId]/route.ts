import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const recipientId = request.url.split("send-request/")[1];
        
        if (!recipientId) {
            throw createError("Invalid recipient ID", 400, false);
        }

        const { has, sessionClaims } = auth();
        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!mongoose.isValidObjectId(recipientId)) {
            throw createError("Invalid recipient ID", 400, false);
        }

        const existingRequest = await Friendship.findOne({
            user: mongoId,
            friend: recipientId,
            status: 'pending',
        });
        
        if (existingRequest) {
            throw createError("Friend request already sent", 400, false);
        }

        const friendRequest = await Friendship.create({
            user: mongoId,
            friend: recipientId,
        });

        if (!friendRequest) {
            throw createError("Error sending friend request", 500, false);
        }

        return new Response(
            JSON.stringify(createResponse("Friend request sent successfully", 200, true, friendRequest)),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while sending friend request:", error);
        throw createError("Internal Server Error", 500, false, error);
    }
}