import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Friends | SpendShare',
    description: 'Share your experience and provide feedback on ShareSpend. Help us improve our expense tracking app and make it better for everyone. Your insights and suggestions matter.',
    alternates: {
        canonical: "/feedback"
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return children
}