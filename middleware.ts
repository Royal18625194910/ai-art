import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 定义需要保护的路由
const isProtectedRoute = createRouteMatcher([
  '/api/generate(.*)',      // 生成图片 API
  '/api/upload(.*)',        // 文件上传 API
  '/create',                // 创作页面
  '/history',               // 历史记录
  '/buy',                   // 购买页面
]);

export default clerkMiddleware(async (auth, req) => {
  // 对保护路由进行认证检查
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 跳过 Next.js 内部文件和所有静态文件
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终运行 API 路由
    '/(api|trpc)(.*)',
  ],
};
