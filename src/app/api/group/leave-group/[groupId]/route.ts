import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("leave-group/")[1];

        const { has, sessionClaims } = auth();
        const currentUserId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        // Check if group ID is provided
        if (!groupId) {
            return Response.json(createError("Invalid group ID", 400, false));
        }

        // Check if group ID is a valid ObjectId
        if (!mongoose.isValidObjectId(groupId)) {
            return Response.json(createError("Invalid group ID", 400, false));
        }

        // Check if the current user is authenticated
        if (!currentUserId) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return Response.json(createError("Invalid group ID", 404, false));
        }

        const userId = new mongoose.Types.ObjectId(currentUserId);

        // Check if the user is a member of the group
        if (!group.members.includes(userId)) {
            return Response.json(createError("You are not a member of this group", 404, false));
        }

        // Check if the leaving member is the admin
        if (group.admin.equals(userId)) {
            // If the leaving member is the admin, change admin to another member in the group
            const newAdminId = group.members.find(memberId => !memberId.equals(currentUserId));
            if (!newAdminId) {
                return Response.json(createError("Failed to leave group: No alternative admin found", 500, false));
            }
            group.admin = newAdminId;
        }

        // Remove the user from the group
        const index = group.members.indexOf(userId);
        group.members.splice(index, 1);
        await group.save();

        // Remove the group from the user's list of groups
        await User.findByIdAndUpdate(currentUserId, { $pull: { groups: groupId } });

        return Response.json(
            createResponse(
                "Group left successfully", 200, true, group
            )
        );
    } catch (error: any) {
        console.log(error);
        return Response.json(createError("Failed to leave group", 500, false));
    }
}