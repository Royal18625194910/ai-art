import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * 从 Clerk API 获取用户信息
 */
async function getClerkUser(clerkId: string) {
  const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Clerk user: ${response.status}`);
  }

  return response.json();
}

/**
 * 获取或创建 Convex 用户
 * 首次使用时自动从 Clerk 同步用户信息
 */
export async function getOrCreateUser(clerkId: string) {
  let user = await convex.query(api.users.getUserByClerkId, { clerkId });

  if (!user) {
    // 从 Clerk 获取用户信息
    const clerkUser = await getClerkUser(clerkId);

    await convex.mutation(api.users.createUser, {
      clerkId,
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      name: clerkUser.first_name || clerkUser.last_name
        ? `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim()
        : undefined,
      imageUrl: clerkUser.image_url,
    });

    // 重新获取用户（包含 _id）
    user = await convex.query(api.users.getUserByClerkId, { clerkId });
  }

  return user;
}

/**
 * 获取 Convex HTTP 客户端实例
 */
export function getConvexClient(): ConvexHttpClient {
  return convex;
}

/**
 * Convex API 引用
 */
export { api };
