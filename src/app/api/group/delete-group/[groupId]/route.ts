import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { Transaction } from "@/models/transaction.models";
import { Owe } from "@/models/owe.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("delete-group/")[1];
        
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

        await User.updateMany(
            { _id: { $in: group.members } },
            { $pull: { groups: groupId } }
        );

        // Delete all transactions and owes associated with the group
        await Transaction.deleteMany({ groupId });
        await Owe.deleteMany({ groupId });

        const deletedData = await Group.findByIdAndDelete(groupId);

        // const avatarToDelete = group.avatar.public_id
        
        // if (avatarToDelete !== "kpvg81dod9pzjaxabbpe") {
        //     await deleteOnCloudinary(avatarToDelete)
        // }

        // if (!deletedData) {
        //     throw new ApiError(500, "Failed to delete group, Try again later");
        // }
        
        // Respond with success message
        return Response.json(
            createResponse(
                "Group deleted successfully", 200, true, deletedData
            )
        );

    } catch (error) {
        console.log("Error while deleting group", error);
        throw createError(
            "Internal Server Error", 500, false
        );
    }
}
