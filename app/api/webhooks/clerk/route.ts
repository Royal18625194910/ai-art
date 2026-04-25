import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Webhook } from 'svix';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Clerk webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // 验证 webhook 签名
    const payload = await req.text();
    const headers = req.headers;

    const svix_id = headers.get('svix-id');
    const svix_timestamp = headers.get('svix-timestamp');
    const svix_signature = headers.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    // 验证签名
    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { type, data } = evt;

    switch (type) {
      case 'user.created':
        await convex.mutation(api.users.createUser, {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          name: data.first_name || data.last_name ? `${data.first_name || ''} ${data.last_name || ''}`.trim() : undefined,
          imageUrl: data.image_url,
        });
        break;

      case 'user.updated':
        await convex.mutation(api.users.updateUser, {
          clerkId: data.id,
          name: data.first_name || data.last_name ? `${data.first_name || ''} ${data.last_name || ''}`.trim() : undefined,
          imageUrl: data.image_url,
        });
        break;

      // 可以处理其他事件如 user.deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
