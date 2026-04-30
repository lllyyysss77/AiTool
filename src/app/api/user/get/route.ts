import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    fetchUnifiedProfile,
    getUnifiedProfileAccountName,
    getUnifiedProfileDisplayName,
} from '@/lib/auth/unifiedBackend';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('sessionToken')?.value;
    if (!token) {
        return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    try {
        const profile = await fetchUnifiedProfile(token, request);
        return NextResponse.json({
            loggedIn: true,
            user: {
                id: profile.id,
                name: getUnifiedProfileAccountName(profile),
                displayName: getUnifiedProfileDisplayName(profile),
                email: profile.email,
            },
        }, { status: 200 });
    } catch (err) {
        console.error('user/get 出错:', err);
        return NextResponse.json({ loggedIn: false }, { status: 200 });
    }
}
