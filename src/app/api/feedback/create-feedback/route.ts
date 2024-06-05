import { connect } from '@/lib/db';
import { createResponse } from '@/utils/ApiResponse';
import { auth } from '@clerk/nextjs/server';
import { createError } from '@/utils/ApiError';
import Feedback from '@/models/feedback.models';

export async function POST(request: Request) {

    await connect();

    try {
        const { has, sessionClaims } = auth();
        const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!mongoId) {
            throw createError("Unauthorized", 401, false);
        }

        const { message } = await request.json();

        if (!message) {
            throw createError("Message is Required", 401, false);
        }

        const feedback = await Feedback.create({
            owner: mongoId,
            message
        });
    
        if (!feedback) {
            throw createError(
                    "Error Submitting Feedback", 500, false
                );
        }

        return Response.json(
            createResponse(
                "Feedback submitted successfully", 200, true, feedback
            )
        );
    } catch (error: any) {
        throw createError(
                "Internal Server Error", 200, false, error
            );
    }
}
