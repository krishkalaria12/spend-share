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
        const {groupId, memberId} = await request.json(); 
        console.log(groupId, memberId);
        const { has, sessionClaims } = auth();
        const currentUserId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        if (!currentUserId) {
            return Response.json(createError("Unauthorized: User not logged in", 401, false));
        }

        if (!isValidObjectId(currentUserId)) {
            return Response.json(createError("Invalid user ID", 400, false));
        }

        if (!groupId || !memberId) {
            return Response.json(createError("Invalid group ID or member ID", 400, false));
        }

        if (!isValidObjectId(groupId) || !isValidObjectId(memberId)) {
            return Response.json(createError("Invalid group ID or member ID", 400, false));
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return Response.json(createError("Invalid group ID", 404, false));
        }

        const userId = new mongoose.Types.ObjectId(currentUserId);

        // Check if the current user is the admin of the group
        if (!group.admin.equals(userId)) {
            return Response.json(createError("Unauthorized: You are not the admin of this group", 401, false));
        }

        // Check if the member exists in the group
        const memberIndex = group.members.indexOf(new mongoose.Types.ObjectId(memberId));
        if (memberIndex === -1) {
            return Response.json(createError("Member not found in group", 404, false));
        }

        // Remove the member from the group
        group.members.splice(memberIndex, 1);
        await group.save();

        // Remove the group from the member's list of groups
        await User.findByIdAndUpdate(memberId, { $pull: { groups: groupId } });

        // Fetch the updated group with populated member details
        const updatedGroup = await Group.findById(groupId)
            .populate<{ members: any[], admin: { _id: any; } }>("members", "_id username email fullName")
            .populate("admin", "_id");

        if (!updatedGroup) {
            return Response.json(createError("Invalid group ID", 404, false));
        }

        // Format the response with isAdmin flag for each member
        const formattedMembers = updatedGroup.members.map(member => ({
            _id: member._id,
            username: member.username,
            email: member.email,
            fullName: member.fullName,
            isAdmin: member._id.equals(updatedGroup.admin._id) // Check if the member is the group admin
        }));

        // Prepare the response object
        const response = {
            _id: updatedGroup._id,
            name: updatedGroup.name,
            description: updatedGroup.description,
            members: formattedMembers,
            admin: updatedGroup.admin._id,
            avatar: updatedGroup.avatar,
            createdAt: updatedGroup.createdAt,
            updatedAt: updatedGroup.updatedAt,
            __v: updatedGroup.__v
        };

        return Response.json(
            createResponse(
                "Successfully removed member from group", 200, true, response
            )
        );
    } catch (error) {
        console.error("Error while removing member from group:", error);
        return Response.json(createError("Error while removing member from group", 500, false));
    }
}
