export type Feedback = {
    _id: string;
    owner: { username: string; avatar: { url: string }; clerkId: string };
    message: string;
    createdAt: string;
    isLiked: boolean;
};

export interface Expense {
    _id: string;
    title: string;
    description: string;
    amount: number;
    category: string;
    createdAt: string;
}

export interface ExpenseComparison {
    weekExpense: number;
    monthExpense: number;
    percentageComparison: {
        week: string;
        month: string;
    };
    overallExpenseAmount: number;
}

export type ExpenseCategory = {
    category: string;
    totalExpense: number;
    expenses: {
        _id: string;
        title: string;
        amount: number;
        description: string;
        createdAt: string;
    }[];
};

export interface GroupFriend {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface Friend {
    clerkId?: string | null | undefined;
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    isAdmin?: boolean;
}

export interface FriendRequest {
    _id: string;
    user: Friend;
    status: 'pending' | 'fulfilled';
    createdAt: Date;
    updatedAt: Date;
}

export interface Group {
    _id: string;
    name: string;
    description: string;
    friends: Friend[];
    members: Friend[];
    avatar: string;
    isAdmin?: boolean;
    totalMembers?: number;
}

export interface Transaction {
    owes: any;
    totalAmount: any;
    _id: string;
    title: string;
    amount: number;
    description: string;
    category: string;
    paid: boolean;
    creditor: {
        _id: string;
        username: string;
        avatar: string;
    };
    createdAt: string;
}

export interface Owe {
    _id: string;
    category: string;
    amount: number;
    title: string;
    description?: string;
    paid: boolean;
    debtor: string;
    creditor: string;
    status: 'pending' | 'confirmed';
    debtorInfo?: {
        email: string;
        fullName: string;
        username: string;
        avatar: string;
    };
    creditorInfo?: {
        email: string;
        fullName: string;
        username: string;
        avatar: string;
    };
}

export interface OweCreation {
    category: string;
    amount: number;
    title: string;
    description?: string;
    friendId?: string;
}
