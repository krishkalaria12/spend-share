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
        week: number;
        month: number;
    };
    overallExpenseAmount: number;
}

export interface ExpenseCategory {
    category: string;
    expenses: Expense[];
}

export interface GroupFriend {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface Friend {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    isAdmin?: boolean;
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

