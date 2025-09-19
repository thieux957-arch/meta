import { NextResponse } from 'next/server';
import { decryptAES } from '../../utils/crypto';
import { sendTelegramMessage } from '../../utils/telegram';
import axios from 'axios';

const WEBHOOK_URL = process.env.WEBHOOK_URL!; // ✅ Lấy từ Environment Variable

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawData = body?.data;

    if (!rawData || typeof rawData !== 'string') {
      return NextResponse.json(
        { message: "Invalid request: 'data' is required", error_code: 1 },
        { status: 400 }
      );
    }

    let decrypted: string;
    try {
      decrypted = decryptAES(rawData);
    } catch {
      return NextResponse.json(
        { message: 'Decryption failed', error_code: 3 },
        { status: 400 }
      );
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(decrypted);
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON format after decryption', error_code: 4 },
        { status: 400 }
      );
    }

    // ✅ Gửi về Telegram
    await sendTelegramMessage(parsedData);

    // ✅ Gửi thêm về Webhook
    if (WEBHOOK_URL) {
      try {
        await axios.post(WEBHOOK_URL, parsedData, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('✅ Sent data to Webhook');
      } catch (err: any) {
        console.error('🔥 Webhook send error:', err?.response?.data || err.message || err);
      }
    }

    return NextResponse.json({ message: 'Success', error_code: 0 }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error_code: 2 },
      { status: 500 }
    );
  }
}
