import { connect } from "@/lib/db";
import User from "@/models/user.models";
import { Friendship } from "@/models/friendship.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  await connect();

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    const { has, sessionClaims } = auth();
    const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

    if (!has) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    if (!isValidObjectId(userId)) {
      return new Response(
        JSON.stringify(createError("Unauthorized", 401, false)),
        { status: 401 }
      );
    }

    // Get the user's friends and pending requests
    const friendIds = await Friendship.aggregate([
      {
        $match: {
          $or: [
            { user: new mongoose.Types.ObjectId(userId) },
            { friend: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $project: {
          friend: {
            $cond: {
              if: { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
              then: "$friend",
              else: "$user"
            }
          }
        }
      }
    ]);

    const excludedUserIds = friendIds.map(friendship => friendship.friend);

    const pipeline: any[] = [];

    pipeline.push({
      $search: {
        index: "search-friends",
        text: {
          query: query,
          path: ["username", "fullName", "email"]
        }
      }
    });

    pipeline.push({
      $match: {
        _id: { $nin: [...excludedUserIds, new mongoose.Types.ObjectId(userId)] }
      }
    });

    pipeline.push({
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullName: 1,
        avatar: 1
      }
    });

    const friends = await User.aggregate(pipeline);

    return new Response(
      JSON.stringify(
        createResponse("Friends fetched successfully", 200, true, friends)
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify(createError("Internal Server Error", 500, false, error)),
      { status: 500 }
    );
  }
}
