import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const friends = formData.get("friends");
        const avatar = formData.get("avatar");

        const { has, sessionClaims } = auth();
        const adminId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!adminId || !mongoose.isValidObjectId(adminId)) {
            throw createError("Unauthorized", 401, false);
        }

        if (!name || !description) {
            throw createError("Invalid group name or description", 400, false);
        }

        const members = friends?.toString().split(",");
        
        if (!members || !Array.isArray(members) || members.length < 1) {
            throw createError("Invalid members", 400, false);
        }

        if (!members.includes(adminId)) {
            members.push(adminId);
        }

        for (const memberId of members) {
            if (!mongoose.isValidObjectId(memberId)) {
                throw createError("Invalid member ID", 400, false);
            }
        }

        const groupData = {
            name,
            description,
            members,
            admin: adminId,
            creator: adminId,
            avatar: avatar || ""
        };

        const group = await Group.create(groupData);

        if (!group) {
            throw createError("Failed to create group", 500, false);
        }

        await User.updateMany(
            { _id: { $in: members } },
            { $addToSet: { groups: group._id } }
        );

        return new Response(
            JSON.stringify(createResponse("Group created successfully", 201, true, group)),
            { status: 201 }
        );

    } catch (error) {
        console.log("Error while creating group", error);
        throw createError("Internal Server Error", 500, false);
    }
}
