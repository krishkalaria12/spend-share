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

export interface Group {
    _id: string;
    name: string;
    description: string;
    members: Friend[];
    avatar: string;
}
