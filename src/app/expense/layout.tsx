import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Expense | SpendShare',
    description: 'Keep detailed records of all your expenses with ShareSpend. Track spending, categorize transactions, and view comprehensive reports. Simplify your personal and group financial management',
    alternates: {
        canonical: "/expense"
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return children
}