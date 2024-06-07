import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const groupId = request.url.split("get-group-by-id/")[1];
        
        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            return Response.json(createError("Unauthorized", 401, false));
        }

        // Validate group ID
        if (!isValidObjectId(groupId)) {
            return Response.json(createError("Invalid group ID", 400, false));
        }

        if (!groupId) {
            return Response.json(createError("Invalid group ID", 400, false));
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
                $addFields: {
                    avatar: "$avatar.url" // Extract avatar URL from the group document
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
                $lookup: {
                    from: "users",
                    localField: "admin.friends",
                    foreignField: "_id",
                    as: "adminFriends" // Populate admin's friends details
                }
            },
            {
                $addFields: {
                    totalMembers: { $size: "$members" }, // Calculate total number of members
                    isAdmin: { $eq: ["$admin._id", userId] } // Check if the requesting user is the admin
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "admin._id",
                    foreignField: "_id",
                    as: "adminDetails" // Populate admin details
                }
            },
            {
                $unwind: "$adminDetails" // Unwind the adminDetails field
            },
            {
                $addFields: {
                    friends: {
                        $cond: {
                            if: "$isAdmin", // If the user is an admin
                            then: "$adminFriends",
                            else: [] // Otherwise, empty array
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "admin.friends",
                    foreignField: "_id",
                    as: "allAdminFriends" // Fetch all friends of the admin
                }
            },
            {
                $addFields: {
                    friendsNotInGroup: {
                        $filter: {
                            input: "$allAdminFriends",
                            as: "friend",
                            cond: {
                                $not: {
                                    $in: ["$friend._id", "$members._id"] // Filter out friends who are already members of the group
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
                            if: { $eq: [{ $size: "$friendsNotInGroup" }, 0] }, // Check if friendsNotInGroup is empty
                            then: [],
                            else: "$friendsNotInGroup" // Otherwise, include friendsNotInGroup in the friends array
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
                        avatar: {
                            url: 1
                        }
                    },
                    totalMembers: 1,
                    isAdmin: 1,
                    createdAt: 1,
                    friends: {
                        $map: {
                            input: "$friends",
                            as: "friend",
                            in: {
                                username: "$friend.username",
                                email: "$friend.email",
                                fullName: "$friend.fullName",
                                avatar: {
                                    url: "$friend.avatar.url"
                                },
                                _id: "$friend._id"
                            }
                        }
                    },
                    avatar: 1 // Include the avatar field
                }
            }            
        ]);

        // Check if the group exists
        if (!group || group.length === 0) {
            return Response.json(
                createError(
                    "Group not found", 404, false
                )
            );
        }

        // Respond with the group details
        return Response.json(
            createResponse(
                "Group found successfully", 200, true, group[0]
            )
        )
    } catch (error) {
        console.log(error);
        return Response.json(
            createError(
                "Internal Server Error", 500, false
            )
        );
    }
}