import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("get-group-member/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw createError("Invalid user ID", 400, false);
        }

        if (!groupId || !mongoose.isValidObjectId(groupId)) {
            throw createError("Invalid group ID", 400, false);
        }

        const group = await Group.findById(groupId).populate("members");

        if (!group) {
            throw createError("Invalid Group", 400, false);
        }

        const members = await User.find({ _id: { $in: group.members } });

        if (!members) {
            throw createError("Member for the group not found!",400,false);
        }

        return Response.json(
            createResponse(
                "Fetched Group Members successfully", 200, true, {members}
            )
        ); 
    } catch (error) {
        console.log("Error while gettting group member", error);
        throw createError("Internal server error", 500, false);
    }
}