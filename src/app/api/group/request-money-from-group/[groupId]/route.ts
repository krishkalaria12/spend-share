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
        const { amount, description, title, category, selectedMembers } = await request.json();
        const groupId = request.url.split("request-money-from-group/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw createError("Invalid user ID", 400, false);
        }

        if (!groupId || !mongoose.isValidObjectId(groupId)) {
            throw createError("Invalid group ID", 400, false);
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            throw createError("Invalid amount", 400, false);
        }

        if (!description) {
            throw createError("Invalid description", 400, false);
        }

        if (!Array.isArray(selectedMembers) || selectedMembers.length < 1) {
            throw createError("At least one member must be selected", 400, false);
        }

        const group = await Group.findById(groupId);
        if (!group) {
            throw createError("Group does not exist", 404, false);
        }

        if (!group.members.includes(new mongoose.Types.ObjectId(userId))) {
            throw createError("Unauthorized to add member", 401, false);
        }

        const allSelectedMembers = [...selectedMembers, userId];
        const totalMembers = allSelectedMembers.length;
        const amountPerMember = amount / totalMembers;

        const transaction = await Transaction.create({
            groupId,
            userId,
            amount,
            description,
            title,
            category,
            members: allSelectedMembers
        });

        if (!transaction) {
            throw createError("Failed to create transaction", 500, false);
        }

        const oweRecords = await Promise.all(allSelectedMembers.map(async memberId => {
            const isPaid = memberId === userId;
            const oweRecord = await Owe.create({
                groupId,
                creditor: userId,
                debtor: memberId,
                amount: amountPerMember,
                description,
                title,
                category,
                paid: isPaid,
                transactionId: transaction._id
            });
            return oweRecord;
        }));

        if (!oweRecords) {
            throw createError("Failed to create owe records", 500, false);
        }

        const filteredOweRecords = oweRecords.filter(record => record !== null);

        return Response.json(
            createResponse(
                "Requested money successfully", 200, true, filteredOweRecords
            )
        );
    } catch (error: any) {
        console.log("Error while requesting money from group", error);
        throw createError("Internal server error", 500, false);
    }
}
