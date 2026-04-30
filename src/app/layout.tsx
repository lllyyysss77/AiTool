import './globals.css';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import {
    fetchUnifiedProfile,
    getUnifiedProfileAccountName,
    getUnifiedProfileDisplayName,
} from '@/lib/auth/unifiedBackend';
import { UserProvider, User } from './providers/UserProvider';
import ClientBoot from './ClientBoot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'AiTool 2.0',
    description: 'Owen Shen personal tools, products, notes, and AI workbench.',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tokenCookie = cookies().get('sessionToken')?.value;
    let initialUser: User | null = null;

    if (tokenCookie) {
        try {
            const profile = await fetchUnifiedProfile(tokenCookie);
            initialUser = {
                name: getUnifiedProfileAccountName(profile),
                displayName: getUnifiedProfileDisplayName(profile),
            };
        } catch (e) {
            console.error('SSR unified backend fetch-profile failed', e);
        }
    }

    return (
        <html lang="zh-CN">
        <head>
        </head>
        <body className={inter.className}>
        <UserProvider initialUser={initialUser}>
            <ClientBoot />
            <NavBar />
            {children}
            <Footer />
            <LoginModal />
        </UserProvider>
        </body>
        </html>
    );
}
