import { connect } from "@/lib/db";
import User from "@/models/user.models";
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

    // for using Full Text based search u need to create a search index in mongoDB atlas
    // you can include field mapppings in search index eg.title, description, as well
    // Field mappings specify which fields within your documents should be indexed for text search.
    // this helps in seraching only in title, desc providing faster search results
    // here the name of search index is 'search-user'

    const pipeline: any[] = [];

    if (query) {
      if (!isValidObjectId(userId)) {
        return new Response(
          JSON.stringify(createError("Unauthorized", 401, false)),
          { status: 401 }
        );
      }

      pipeline.push({
        $search: {
          index: "search-user",
          text: {
            query,
            path: ["username", "fullName"],
          },
        },
      });
    }

    if (userId) {
      pipeline.push({
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullName: 1,
        avatar: 1,
      },
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
