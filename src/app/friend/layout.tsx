import { Metadata } from "next"

export const metadata:  Metadata = {
    title: 'Friends | SpendShare',
    description: 'Manage your expenses with friends using ShareSpend. Record transactions, track balances, and keep financial interactions transparent. Make managing money with friends easy and stress-free.',
    alternates: {
        canonical: "/friend"
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return children
}