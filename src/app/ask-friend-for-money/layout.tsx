import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Friends | SpendShare',
    description: 'Simplify managing money with friends using ShareSpend. Track who owes whom, record transactions, and stay on top of shared expenses. Make group financial interactions seamless and fair.',
    alternates: {
        canonical: "/ask-money-from-friend"
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return children
}