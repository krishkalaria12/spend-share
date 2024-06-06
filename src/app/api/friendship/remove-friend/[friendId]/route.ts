import { connect } from "@/lib/db";
import { Friendship } from "@/models/friendship.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId } from "mongoose";

export async function DELETE(request: Request) {
  await connect();

  try {
    const url = new URL(request.url);
    const friendId = url.pathname.split("remove-friend/")[1];

    if (!friendId) {
      return new Response(
        JSON.stringify(createError("Invalid friend ID", 400, false)),
        { status: 400 }
      );
    }

    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!has || !mongoId) {
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

    const friendship = await Friendship.findOne({
      user: mongoId,
      friend: friendId
    });

    if (!friendship) {
      return new Response(
        JSON.stringify(createError("Friendship not found", 404, false)),
        { status: 404 }
      );
    }

    const deletedFriendship = await Friendship.findByIdAndDelete(friendship._id);

    if (!deletedFriendship) {
      return new Response(
        JSON.stringify(createError("Failed to delete friendship", 400, false)),
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(mongoId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: mongoId } });

    return new Response(
      JSON.stringify(createResponse("Friend deleted successfully", 200, true, deletedFriendship)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting friend:", error);
    return new Response(
      JSON.stringify(createError("Internal Server Error", 500, false, error)),
      { status: 500 }
    );
  }
}
