import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const requestId = request.url.split("accept-request/")[1];

        if (!requestId) {
            throw createError("Invalid request ID", 400, false);
        }

        const { has, sessionClaims } = auth();
        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!mongoose.isValidObjectId(requestId)) {
            throw createError("Invalid request ID", 400, false);
        }
        
        const friendRequest = await Friendship.findOne({
            user: requestId,
            friend: mongoId
        });
        
        if (!friendRequest || friendRequest.status !== 'pending') {
            throw createError("Friend request not found or already processed", 404, false);
        }

        if (!friendRequest.friend.equals(mongoId)) {
            throw createError("Unauthorized to accept this request", 401, false);
        }

        friendRequest.status = 'fulfilled';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.user, { $addToSet: { friends: friendRequest.friend } });
        await User.findByIdAndUpdate(friendRequest.friend, { $addToSet: { friends: friendRequest.user } });

        return new Response(
            JSON.stringify(createResponse("Friend request accepted successfully", 200, true, friendRequest)),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while accepting friend request:", error);
        throw createError("Internal Server Error", 500, false, error);
    }
}
