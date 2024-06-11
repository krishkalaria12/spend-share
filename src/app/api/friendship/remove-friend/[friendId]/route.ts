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
    const friendId = request.url.split("remove-friend/")[1];

    if (!friendId) {
      throw createError("Invalid friend ID", 400, false);
    }

    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!has || !mongoId) {
      throw createError("Unauthorized", 401, false);
    }

    if (!isValidObjectId(friendId)) {
      throw createError("Invalid friend ID", 400, false);
    }

    const friendship = await Friendship.findOne({
      user: mongoId,
      friend: friendId
    });

    if (!friendship) {
      throw createError("Friendship not found", 404, false);
    }

    const deletedFriendship = await Friendship.findByIdAndDelete(friendship._id);

    if (!deletedFriendship) {
      throw createError("Failed to delete friendship", 400, false);
    }

    await User.findByIdAndUpdate(mongoId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: mongoId } });

    return new Response(
      JSON.stringify(createResponse("Friend deleted successfully", 200, true, deletedFriendship)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting friend:", error);
    throw createError("Internal Server Error", 500, false, error);
  }
}
