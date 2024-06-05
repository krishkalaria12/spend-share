import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IFriendship extends Document {
    user: mongoose.Types.ObjectId;
    friend: mongoose.Types.ObjectId;
}

const friendshipSchema: Schema<IFriendship> = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

friendshipSchema.plugin(mongooseAggregatePaginate);

export const Friendship: Model<IFriendship> = mongoose.models.Friendship || mongoose.model<IFriendship>('Expense', friendshipSchema)
