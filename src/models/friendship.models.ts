import mongoose, { Schema, Document, Model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IFriendship extends Document {
    user: mongoose.Types.ObjectId;
    friend: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const friendshipSchema: Schema<IFriendship> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        friend: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Friend is required'],
        },
    },
    {
        timestamps: true,
    }
);

friendshipSchema.plugin(mongooseAggregatePaginate);

export const Friendship: Model<IFriendship> = mongoose.models.Friendship || mongoose.model<IFriendship>('Friendship', friendshipSchema);
