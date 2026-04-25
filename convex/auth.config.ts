// 使用 Clerk 的 JWT 模板进行认证
// 需要在 Clerk Dashboard 中创建 "convex" JWT 模板
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://clerk.your-domain.com",
      applicationID: "convex",
    },
  ],
};
