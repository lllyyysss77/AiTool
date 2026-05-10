import type { UnifiedBackendProfile } from './unifiedBackend';

function readAdminEmails() {
    return (process.env.AITOOL_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}

export function isAdminProfile(profile: Pick<UnifiedBackendProfile, 'email' | 'admin_services'> | null | undefined) {
    if (profile?.admin_services?.some((item) => item.service_code === 'appapi' && item.status === 'active')) {
        return true;
    }

    const email = profile?.email?.trim().toLowerCase();
    if (!email) return false;

    const adminEmails = readAdminEmails();
    if (adminEmails.length > 0) return adminEmails.includes(email);

    return process.env.NODE_ENV !== 'production';
}
