export type Feedback = {
    _id: string;
    owner: { username: string; avatar: { url: string }; clerkId: string };
    message: string;
    createdAt: string;
    isLiked: boolean;
};

export interface Friend {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
}
