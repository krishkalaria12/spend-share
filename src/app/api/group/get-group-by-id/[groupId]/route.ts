import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";
import { Friendship } from "@/models/friendship.models";

export async function GET(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("get-group-by-id/")[1];
        
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

        // MongoDB aggregation pipeline to fetch group details
        const group = await Group.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(groupId) } // Filter by group ID
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members" // Populate member details
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "admin",
                    foreignField: "_id",
                    as: "admin" // Populate admin details
                }
            },
            {
                $unwind: "$members"
            },
            {
                $addFields: {
                    "members.isAdmin": { $eq: ["$members._id", { $arrayElemAt: ["$admin._id", 0] }] }
                }
            },
            {
                $sort: { "members.fullName": 1 } // Sort members alphabetically by full name
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    admin: { $first: "$admin" },
                    members: { $push: "$members" },
                    createdAt: { $first: "$createdAt" },
                    avatar: { $first: "$avatar" } // Keep the avatar field in the output
                }
            },
            {
                $unwind: "$admin" // Unwind the admin field
            },
            {
                $addFields: {
                    totalMembers: { $size: "$members" }, // Calculate total number of members
                    isAdmin: { $eq: ["$admin._id", new mongoose.Types.ObjectId(userId)] } // Check if the requesting user is the admin
                }
            },
            {
                $lookup: {
                    from: "friendships",
                    let: { adminId: "$admin._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$adminId"] },
                                        { $eq: ["$status", "fulfilled"] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "friend",
                                foreignField: "_id",
                                as: "friendDetails"
                            }
                        },
                        {
                            $unwind: "$friendDetails"
                        },
                        {
                            $project: {
                                "friendDetails._id": 1,
                                "friendDetails.username": 1,
                                "friendDetails.email": 1,
                                "friendDetails.fullName": 1,
                                "friendDetails.avatar": 1
                            }
                        }
                    ],
                    as: "adminFriends"
                }
            },
            {
                $addFields: {
                    friendsNotInGroup: {
                        $filter: {
                            input: "$adminFriends",
                            as: "friend",
                            cond: {
                                $not: {
                                    $in: ["$$friend.friendDetails._id", "$members._id"] // Filter out friends who are already members of the group
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    friends: {
                        $cond: {
                            if: "$isAdmin", // If the user is an admin
                            then: "$friendsNotInGroup",
                            else: [] // Otherwise, empty array
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        fullName: 1,
                        isAdmin: 1,
                        avatar: 1,
                    },
                    totalMembers: 1,
                    isAdmin: 1,
                    createdAt: 1,
                    friends: {
                        $map: {
                            input: "$friends",
                            as: "friend",
                            in: {
                                username: "$$friend.friendDetails.username",
                                email: "$$friend.friendDetails.email",
                                fullName: "$$friend.friendDetails.fullName",
                                avatar: "$$friend.friendDetails.avatar",
                                _id: "$$friend.friendDetails._id"
                            }
                        }
                    },
                    avatar: 1 // Include the avatar field
                }
            }
        ]);

        // Check if the group exists
        if (!group || group.length === 0) {
            throw createError(
                "Group not found", 404, false
            );
        }

        // Respond with the group details
        return Response.json(
            createResponse(
                "Group found successfully", 200, true, group[0]
            )
        )
    } catch (error) {
        console.log("Error while fetching group details", error);
        throw createError(
            "Internal Server Error", 500, false
        );
    }
}
