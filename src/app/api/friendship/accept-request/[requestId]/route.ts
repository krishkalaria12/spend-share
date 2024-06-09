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
            return new Response(
                JSON.stringify(createError("Invalid request ID", 400, false)),
                { status: 400 }
            );
        }

        const { has, sessionClaims } = auth();
        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        if (!mongoose.isValidObjectId(requestId)) {
            return new Response(
                JSON.stringify(createError("Invalid request ID", 400, false)),
                { status: 400 }
            );
        }

        const friendRequest = await Friendship.findById(requestId);

        console.log(friendRequest);
        console.log(requestId);

        if (!friendRequest || friendRequest.status !== 'pending') {
            return new Response(
                JSON.stringify(createError("Friend request not found or already processed", 404, false)),
                { status: 404 }
            );
        }

        if (!friendRequest.friend.equals(mongoId)) {
            return new Response(
                JSON.stringify(createError("Unauthorized to accept this request", 401, false)),
                { status: 401 }
            );
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
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false, error)),
            { status: 500 }
        );
    }
}
