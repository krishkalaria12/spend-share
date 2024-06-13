import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId, Types } from "mongoose";

export async function GET(request: Request) {
    await connect();

    try {
        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!isValidObjectId(userId)) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        if (!has) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        if (!userId) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        const aggregationPipeline = [
            {
                $facet: {
                    friends: [
                        {
                            $match: {
                                $or: [
                                    { user: new Types.ObjectId(userId), status: 'fulfilled' },
                                    { friend: new Types.ObjectId(userId), status: 'fulfilled' },
                                ],
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                let: { friendId: { $cond: { if: { $eq: ['$user', new Types.ObjectId(userId)] }, then: '$friend', else: '$user' } } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$friendId'] } } },
                                    { $project: { _id: 1, username: 1, email: 1, fullName: 1, avatar: 1 } },
                                ],
                                as: 'friendDetails',
                            },
                        },
                        { $unwind: '$friendDetails' },
                        {
                            $project: {
                                _id: '$friendDetails._id',
                                username: '$friendDetails.username',
                                email: '$friendDetails.email',
                                fullName: '$friendDetails.fullName',
                                avatar: '$friendDetails.avatar',
                                friendshipId: '$_id'
                            }
                        }
                    ],
                    pendingRequests: [
                        {
                            $match: {
                                friend: new Types.ObjectId(userId),
                                status: 'pending',
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user',
                                foreignField: '_id',
                                as: 'userDetails',
                            },
                        },
                        { $unwind: '$userDetails' },
                        {
                            $project: {
                                _id: 1,
                                user: {
                                    _id: '$userDetails._id',
                                    username: '$userDetails.username',
                                    email: '$userDetails.email',
                                    fullName: '$userDetails.fullName',
                                    avatar: '$userDetails.avatar',
                                },
                                createdAt: 1,
                            },
                        },
                    ],
                    yourRequests: [
                        {
                            $match: {
                                user: new Types.ObjectId(userId),
                                status: 'pending',
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'friend',
                                foreignField: '_id',
                                as: 'friendDetails',
                            },
                        },
                        { $unwind: '$friendDetails' },
                        {
                            $project: {
                                _id: 1,
                                user: {
                                    _id: '$friendDetails._id',
                                    username: '$friendDetails.username',
                                    email: '$friendDetails.email',
                                    fullName: '$friendDetails.fullName',
                                    avatar: '$friendDetails.avatar',
                                },
                                createdAt: 1,
                                pending: true,
                            },
                        },
                    ],
                },
            },
        ];

        const results = await Friendship.aggregate(aggregationPipeline);
        const friends = results[0].friends.map((friend: { _id: any; username: any; email: any; fullName: any; avatar: any; friendshipId: { toString: () => any; }; }) => ({
            _id: friend._id,
            username: friend.username,
            email: friend.email,
            fullName: friend.fullName,
            avatar: friend.avatar,
            friendshipId: friend.friendshipId.toString()
        }));
        const pendingRequests = results[0].pendingRequests;
        const yourRequests = results[0].yourRequests;

        return new Response(
            JSON.stringify(createResponse("Successfully fetched friends and requests", 200, true, { friends, pendingRequests, yourRequests })),
            { status: 200 }
        );
    } catch (error) {
        console.log('Error:', error);
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false, error)),
            { status: 500 }
        );
    }
}
