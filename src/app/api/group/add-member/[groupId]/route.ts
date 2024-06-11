import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("add-member/")[1];

        const { memberIds } = await request.json();
        
        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        // Validate group ID
        if (!isValidObjectId(groupId)) {
            throw createError("Invalid group ID", 400, false);
        }

        if (!groupId) {
            throw createError("Invalid group ID", 400, false);
        }

        const group = await Group.findById(groupId);

        // Check if the group exists
        if (!group) {
            throw createError("Group does not exist", 404, false);
        }

        const mongoId = new mongoose.Types.ObjectId(userId);

        // Check if the current user is the admin of the group
        if (!mongoId.equals(group.admin)) {
            throw createError("Unauthorized to delete group", 401, false);
        }

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            throw createError("Member IDs must be provided as an array", 400, false);
        }

        const invalidMemberIds = [];
        for (const memberId of memberIds) {
            if (!mongoose.isValidObjectId(memberId)) {
                invalidMemberIds.push(memberId);
            } else {
                const user = await User.findById(memberId);
                if (!user) {
                    invalidMemberIds.push(memberId);
                }
            }
        }

        // Throw an error if any invalid member IDs were found
        if (invalidMemberIds.length > 0) {
            throw createError(`Invalid member IDs: ${invalidMemberIds.join(", ")}`, 400, false);
        }

        for (const memberId of memberIds) {
            if (!group.members.includes(memberId)) {
                group.members.push(memberId);
                // Update the user's list of groups
                await User.findByIdAndUpdate(memberId, { $addToSet: { groups: groupId } });
            }
        }
    
        // Save the updated group
        await group.save();
    
        // Fetch the updated group with populated member details
        const updatedGroup = await Group.findById(groupId)
            .populate<{ members: any[], admin: { _id: any; } }>("members", "_id username email fullName")
            .populate("admin", "_id");
        
        if (!updatedGroup) {
            throw createError("Group does not exist", 404, false);
        }
    
        // Format the response with isAdmin flag for each member
        const formattedMembers = updatedGroup.members.map((member) => ({
            _id: member._id,
            username: member.username,
            email: member.email,
            fullName: member.fullName,
            isAdmin: member._id.equals(group.admin._id) // Check if the member is the group admin
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
                "Successfully added members to group", 200, true, response
            )
        );

    } catch (error) {
        console.log("Error while adding members to group", error);
        throw createError(
            "Internal Server Error", 500, false
        );
    }

}
