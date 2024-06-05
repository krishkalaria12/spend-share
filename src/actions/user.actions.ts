"use server";

import User from "@/models/user.models";
import { connect } from "@/lib/db";

export async function createUser(user: any) {
    try {
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser(clerkId: string,updateData: any) {
    try {
        await connect();
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            updateData,
            { new: true }
        );
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log(error);
    }
}