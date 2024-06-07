import { connect } from "@/lib/db";
import { Group } from "@/models/group.models";
import { Owe } from "@/models/owe.models";
import { Transaction } from "@/models/transaction.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const { amount, description, title, category } = await request.json();
        const groupId = request.url.split("request-money-from-group/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
        return Response.json(createError("Unauthorized", 401, false));
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
        return Response.json(createError("Invalid user ID", 400, false));
        }

        if (!groupId || !mongoose.isValidObjectId(groupId)) {
        return Response.json(createError("Invalid group ID", 400, false));
        }

        if (!amount || isNaN(amount) || amount <= 0) {
        return Response.json(createError("Invalid amount", 400, false));
        }

        if (!description) {
        return Response.json(createError("Invalid description", 400, false));
        }

        const group = await Group.findById(groupId);
        if (!group) {
        return Response.json(createError("Group does not exist", 404, false));
        }

        if (!group.members.includes(new mongoose.Types.ObjectId(userId))) {
        return Response.json(createError("Unauthorized to add member", 401, false));
        }

        const totalMembers = group.members.length;
        const amountPerMember = amount / totalMembers;

        // Create transaction record including the member IDs
        const transaction = await Transaction.create({
            groupId,
            userId,
            amount,
            description,
            title,
            category,
            members: group.members
        });

        if (!transaction) {
            return Response.json(createError("Failed to create transaction", 500, false));
        }

        // Create owe records for each member (excluding the requester) and update with transaction ID
        const oweRecords = await Promise.all(group.members.map(async memberId => {
        if (!memberId.equals(userId)) {
            const oweRecord = await Owe.create({
                groupId,
                creditor: userId,
                debtor: memberId,
                amount: amountPerMember,
                description,
                title,
                category,
                transactionId: transaction._id // Update with transaction ID
            });
            return oweRecord;
        }
        else {
            const oweRecord = await Owe.create({
                groupId,
                creditor: userId,
                debtor: memberId,
                amount: amountPerMember,
                description,
                title,
                category,
                paid: true,
                transactionId: transaction._id // Update with transaction ID
            });
            return oweRecord;
        }
        }));

        if (!oweRecords) {
        return Response.json(createError("Failed to create owe records", 500, false));
        }

        const filteredOweRecords = oweRecords.filter(record => record !== null);

        return Response.json(
        createResponse(
            "Requested money successfully", 200, true, filteredOweRecords
        )
        );
    } catch (error: any) {
        console.log(error);
        return Response.json(createError("Internal server error", 500, false));
    }
}