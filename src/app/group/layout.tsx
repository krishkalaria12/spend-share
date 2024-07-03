import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Your Groups | SpendShare',
    description: 'Effortlessly manage group expenses with ShareSpend. Create groups, record transactions, and track shared costs. Simplify financial management and settle balances with ease',
    alternates: {
        canonical: "/group"
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return children
}