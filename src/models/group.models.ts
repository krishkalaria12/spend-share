import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroup extends Document {
    name: string;
    description: string;
    members: mongoose.Types.ObjectId[];
    admin: mongoose.Types.ObjectId;
    avatar: {
        public_id: string;
        url: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const groupSchema: Schema<IGroup> = new Schema({
    name: {
        type: String,
        required: [true, "Name for the group is required"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Description for the group is required"],
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Admin for the group is required"],
    },
    avatar: {
        public_id: {
            type: String,
            default: "kpvg81dod9pzjaxabbpe"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/krishbackend/image/upload/v1712999375/kpvg81dod9pzjaxabbpe.png"
        }
    }
}, {
    timestamps: true,
});

export const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', groupSchema);
