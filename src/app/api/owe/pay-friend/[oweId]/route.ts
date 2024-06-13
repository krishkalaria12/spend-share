import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { Owe } from "@/models/owe.models";
import { Transaction } from "@/models/transaction.models";
import User from "@/models/user.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connect();

    try {
        const oweId = request.url.split("pay-friend/")[1];

        const { has, sessionClaims } = auth();
        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;
        
        if (!has) {
            throw createError("Unauthorized", 401, false);
        }

        if (!userId || !mongoose.isValidObjectId(userId) || !oweId || !mongoose.isValidObjectId(oweId)) {
            throw createError("Invalid user ID or OweId", 400, false);
        }

        const mongoId = new mongoose.Types.ObjectId(userId);

        const owe = await Owe.findById(oweId).populate<{ creditor: { _id: string; fullName: string; }, debtor: { _id: string; fullName: string; } }>("creditor debtor");

        if (!owe) {
            throw createError("Owe does not exist", 404, false);
        }

        if (!mongoId.equals(owe.debtor._id)) {
            throw createError("Unauthorized to pay owe", 401, false);
        }

        if (mongoId.equals(owe.creditor._id)) {
            throw createError("You cannot pay yourself", 400, false);
        }

        if (owe.paid) {
            throw createError("Owe has already been paid", 400, false);
        }

        await Owe.findByIdAndUpdate(owe._id, { paid: true });

        const debtorExpense = await Expense.create({
            owner: userId,
            category: owe.category,
            amount: owe.amount,
            title: owe.title,
            description: `Paid ${owe.amount} to ${owe.creditor.fullName} for owed money`,
        });

        const transaction = await Transaction.create({
            creditor: owe.creditor._id,
            debtor: userId,
            category: owe.category,
            amount: owe.amount,
            title: owe.title,
            description: `Paid ${owe.amount} to ${owe.creditor.fullName} for owed money of ${owe.debtor.fullName} on ${owe.title}`,
            userId: owe.debtor._id,  // Ensure this field is populated
        });

        await User.findByIdAndUpdate(owe.creditor._id, { $inc: { balance: owe.amount } });
        await User.findByIdAndUpdate(userId, { $inc: { balance: -owe.amount } });

        return new Response(
            JSON.stringify(
                createResponse(
                    "Successfully paid friend", 200, true, { debtorExpense, transaction }
                )
            ),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while paying friend", error);
        throw createError("Internal server error", 500, false);
    }
}
