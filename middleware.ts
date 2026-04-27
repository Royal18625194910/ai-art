import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 公开路由（不需要登录）
const isPublicRoute = createRouteMatcher([
  '/',                      // 首页
  '/sign-in(.*)',          // 登录页
  '/sign-up(.*)',          // 注册页
  '/api/webhooks(.*)',     // Webhook
  '/api/creem(.*)',        // Creem API (内部处理认证)
  '/buy(.*)',              // 购买页面（支付回调需要访问）
]);

export default clerkMiddleware(async (auth, req) => {
  // 非公开路由需要认证
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
