import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function POST(request: Request) {
  await connect();

  try {
    const friendId = request.url.split("add-friend/")[1];

    if (!friendId) {
      return new Response(
        JSON.stringify(createError("Invalid friend ID", 400, false)),
        { status: 400 }
      );
    }

    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!has) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    if (!isValidObjectId(friendId)) {
      return new Response(
        JSON.stringify(createError("Invalid friend ID", 400, false)),
        { status: 400 }
      );
    }

    const friendship = await Friendship.create({
      user: mongoId,
      friend: friendId,
    });

    if (!friendship) {
      return new Response(
        JSON.stringify(createError("Error adding friend", 500, false)),
        { status: 500 }
      );
    }

    await User.findByIdAndUpdate(mongoId, { $addToSet: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: mongoId } });

    const friendDetailsPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(friendId),
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          fullName: 1,
          'avatar.url': 1,
        },
      },
    ];

    const friendDetails = await User.aggregate(friendDetailsPipeline);

    if (!friendDetails) {
      return new Response(
        JSON.stringify(createError("Error fetching friend details", 500, false)),
        { status: 500 }
      );
    }

    const responseData = {
      friendship,
      friend: friendDetails[0],
    };

    return new Response(
      JSON.stringify(createResponse("Friend added successfully", 200, true, responseData)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while adding friend:", error);
    return new Response(
      JSON.stringify(createError("Internal Server Error", 500, false, error)),
      { status: 500 }
    );
  }
}
