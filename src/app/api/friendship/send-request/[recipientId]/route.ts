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
            return new Response(
                JSON.stringify(createError("Invalid recipient ID", 400, false)),
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

        if (!mongoose.isValidObjectId(recipientId)) {
            return new Response(
                JSON.stringify(createError("Invalid recipient ID", 400, false)),
                { status: 400 }
            );
        }

        const existingRequest = await Friendship.findOne({
            user: mongoId,
            friend: recipientId,
            status: 'pending',
        });
        
        if (existingRequest) {
            return new Response(
                JSON.stringify(createError("Friend request already sent", 400, false)),
                { status: 400 }
            );
        }

        const friendRequest = await Friendship.create({
            user: mongoId,
            friend: recipientId,
        });

        if (!friendRequest) {
            return new Response(
                JSON.stringify(createError("Error sending friend request", 500, false)),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify(createResponse("Friend request sent successfully", 200, true, friendRequest)),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while sending friend request:", error);
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false, error)),
            { status: 500 }
        );
    }
}