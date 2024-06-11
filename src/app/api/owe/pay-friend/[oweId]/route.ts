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

        // Find the owe record and populate creditor and debtor details
        const owe = await Owe.findById(oweId).populate<{ creditor: { _id: string | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | null | undefined; fullName: any; }, debtor: { _id: string | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | null | undefined; fullName: any; } }>("creditor debtor");

        if (!owe) {
            throw createError("Owe does not exist", 404, false);
        }

        // Check if the logged-in user is the debtor of the owe
        if (!mongoId.equals(owe.debtor._id)) {
            throw createError("Unauthorized to pay owe", 401, false);
        }

        // Check if the logged-in user is trying to pay themselves
        if (mongoId.equals(owe.creditor._id)) {
            throw createError("You cannot pay yourself", 400, false);
        }

        // Check if the owe has already been paid
        if (owe.paid) {
            throw createError("Owe has already been paid", 400, false);
        }

        // Update the owe record to mark it as paid
        await Owe.findByIdAndUpdate(owe._id, { paid: true });

        // Create an expense record for the debtor (user who pays)
        const debtorExpense = await Expense.create({
            owner: userId,
            category: owe.category,
            amount: -owe.amount,
            title: owe.title,
            description: `Paid ${owe.amount} to ${owe.creditor.fullName} for owed money`,
        });

        // Create a transaction record to document the payment
        const transaction = await Transaction.create({
            creditor: owe.creditor._id,
            debtor: userId,
            category: owe.category,
            amount: owe.amount,
            description: `Paid ${owe.amount} to ${owe.creditor.fullName} for owed money of ${owe.debtor.fullName} on ${owe.title}`,
        });

        // Update user balances
        await User.findByIdAndUpdate(owe.creditor._id, { $inc: { balance: owe.amount } });
        await User.findByIdAndUpdate(userId, { $inc: { balance: -owe.amount } });

        return Response.json(
            createResponse(
                "Successfully paid friend", 200, true, { debtorExpense, transaction }
            )
        );
    } catch (error) {
        console.log("Error while paying friend", error);
        throw createError("Internal server error", 500, false);
    }
}
