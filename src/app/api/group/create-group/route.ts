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
            return new Response(JSON.stringify(createError("Unauthorized", 401, false)), { status: 401 });
        }

        if (!adminId || !mongoose.isValidObjectId(adminId)) {
            return new Response(JSON.stringify(createError("Unauthorized", 401, false)), { status: 401 });
        }

        if (!name || !description) {
            return new Response(JSON.stringify(createError("Invalid group name or description", 400, false)), { status: 400 });
        }

        const members = friends?.toString().split(",");
        
        if (!members || !Array.isArray(members) || members.length < 1) {
            return new Response(JSON.stringify(createError("Invalid members", 400, false)), { status: 400 });
        }

        if (!members.includes(adminId)) {
            members.push(adminId);
        }

        for (const memberId of members) {
            if (!mongoose.isValidObjectId(memberId)) {
                return new Response(JSON.stringify(createError("Invalid member ID", 400, false)), { status: 400 });
            }
        }

        console.log(avatar);

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
            return new Response(JSON.stringify(createError("Failed to create group", 500, false)), { status: 500 });
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
        console.log(error);
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false)),
            { status: 500 }
        );
    }
}
