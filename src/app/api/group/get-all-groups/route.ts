import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connect();
    
    try {
        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return new Response(JSON.stringify(createError("Unauthorized", 401, false)), { status: 401 });
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return new Response(JSON.stringify(createError("Invalid user ID", 400, false)), { status: 400 });
        }

        const groups = await Group.aggregate([
            { $match: { members: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "admin",
                    foreignField: "_id",
                    as: "admin"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    avatar: "$avatar",
                    members: {
                        $map: {
                            input: "$members",
                            as: "member",
                            in: {
                                _id: "$$member._id",
                                username: "$$member.username",
                                email: "$$member.email",
                                fullName: "$$member.fullName",
                                avatar: "$$member.avatar",
                                isAdmin: {
                                    $eq: ["$$member._id", { $arrayElemAt: ["$admin._id", 0] }]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    "members.fullName": 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    avatar: { $first: "$avatar" },
                    members: { $push: "$members" }
                }
            }
        ]);

        if (!groups) {
            return new Response(JSON.stringify(createError("No groups found", 404, false)), { status: 404 });
        }

        console.log(`Groups found: ${JSON.stringify(groups, null, 2)}`);

        return new Response(
            JSON.stringify(createResponse("Successfully fetched groups", 200, true, groups)),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false)),
            { status: 500 }
        );
    }
}
