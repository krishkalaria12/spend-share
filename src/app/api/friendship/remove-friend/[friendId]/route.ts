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
    const friendshipId = request.url.split("remove-friend/")[1];

    if (!friendshipId) {
      throw createError("Invalid friendship ID", 400, false);
    }

    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!has || !mongoId) {
      throw createError("Unauthorized", 401, false);
    }

    if (!isValidObjectId(friendshipId)) {
      throw createError("Invalid friendship ID", 400, false);
    }

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      throw createError("Friendship not found", 404, false);
    }

    const deletedFriendship = await Friendship.findByIdAndDelete(friendshipId);

    if (!deletedFriendship) {
      throw createError("Failed to delete friendship", 400, false);
    }

    await User.findByIdAndUpdate(mongoId, { $pull: { friends: friendship.friend } });
    await User.findByIdAndUpdate(friendship.friend, { $pull: { friends: mongoId } });

    return new Response(
      JSON.stringify(createResponse("Friend deleted successfully", 200, true, deletedFriendship)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting friend:", error);
    throw createError("Internal Server Error", 500, false, error);
  }
}
