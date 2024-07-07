import { connect } from "@/lib/db";
import { Expense } from "@/models/expense.models";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request: Request){
    await connect();

    try {
        const { has, sessionClaims } = auth();

        if (!has) {
            return new Response(
                JSON.stringify(createError("Unauthorized", 401, false)),
                { status: 401 }
            );
        }

        const userId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;

        if (!isValidObjectId(userId)) {
            return new Response(JSON.stringify(createError("Unauthorized", 401, false)), { status: 401 });
        }

        const today = new Date();

        // Calculate the start and end dates for the present week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

        // Calculate the start and end dates for the past week
        const startOfPastWeek = new Date(startOfWeek);
        startOfPastWeek.setDate(startOfWeek.getDate() - 7);

        const endOfPastWeek = new Date(endOfWeek);
        endOfPastWeek.setDate(endOfWeek.getDate() - 7);

        // Calculate the start and end dates for the present month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Calculate the start and end dates for the previous month
        const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startOfPreviousMonth.setHours(0, 0, 0, 0);

        const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        endOfPreviousMonth.setHours(23, 59, 59, 999);

        // Logging the calculated dates for debugging
        console.log("Start of Week:", startOfWeek);
        console.log("End of Week:", endOfWeek);
        console.log("Start of Past Week:", startOfPastWeek);
        console.log("End of Past Week:", endOfPastWeek);
        console.log("Start of Month:", startOfMonth);
        console.log("End of Month:", endOfMonth);
        console.log("Start of Previous Month:", startOfPreviousMonth);
        console.log("End of Previous Month:", endOfPreviousMonth);

        // Calculate expenses for the present week
        const weekExpense = await calculateExpense(userId, startOfWeek, endOfWeek);

        // Calculate expenses for the past week
        const pastWeekExpense = await calculateExpense(userId, startOfPastWeek, endOfPastWeek);

        // Calculate expenses for the present month
        const monthExpense = await calculateExpense(userId, startOfMonth, endOfMonth);

        // Calculate expenses for the previous month
        const previousMonthExpense = await calculateExpense(userId, startOfPreviousMonth, endOfPreviousMonth);

        // Calculate percentage comparison between present week and past week
        const weekComparison = calculatePercentageComparison(weekExpense, pastWeekExpense);

        // Calculate percentage comparison between present month and previous month
        const monthComparison = calculatePercentageComparison(monthExpense, previousMonthExpense);

        // Calculate overall expenses
        const overallExpense = await calculateOverallExpense(userId);

        const data = {
            monthExpense,
            weekExpense,
            percentageComparison: {
                week: weekComparison,
                month: monthComparison
            },
            overallExpenseAmount: overallExpense,
            totalExpenseAmount: monthExpense // Assuming total expense amount is calculated for the present month
        };

        return new Response(
            JSON.stringify(createResponse("Expense Calculated Successfully", 200, true, data)),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error while fetching expense data:", error);
        return new Response(
            JSON.stringify(createError("Internal Server Error", 500, false, error)),
            { status: 500 }
        );
    }
}

const calculateOverallExpense = async (userId: string) => {
  const expenseAggregate = await Expense.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        totalExpense: 1
      }
    }
  ]);

  return expenseAggregate.length > 0 ? expenseAggregate[0].totalExpense : 0;
};

const calculateExpense = async (userId: string, startDate: Date, endDate: Date) => {
  console.log(`Calculating expense from ${startDate} to ${endDate}`);
  const expenseAggregate = await Expense.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        totalExpense: 1
      }
    }
  ]);

  console.log(`Expense from ${startDate} to ${endDate}:`, expenseAggregate);
  return expenseAggregate.length > 0 ? expenseAggregate[0].totalExpense : 0;
};

// Function to calculate percentage comparison between two expense amounts
const calculatePercentageComparison = (currentExpense: number, previousExpense: number) => {
  if (previousExpense === 0) {
    return "+100%"; // If there's no expense in the previous period, return +100% increase
  }
  const percentage = ((currentExpense - previousExpense) / previousExpense) * 100;
  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
};
