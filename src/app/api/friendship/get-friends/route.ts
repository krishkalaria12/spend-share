import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId } from "mongoose";

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

    const friendships = await Friendship.find({
      $or: [{ user: userId }, { friend: userId }],
    });

    if (!friendships) {
      return new Response(
        JSON.stringify(createError("No friends found", 404, false)),
        { status: 404 }
      );
    }

    const friendIds = friendships.map(f => 
      f.user.toString() === userId ? f.friend : f.user
    );

    const friends = await User.find({ _id: { $in: friendIds } })
      .select("_id username email fullName avatar");

    return new Response(
      JSON.stringify(createResponse("Successfully fetched friends", 200, true, friends)),
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
