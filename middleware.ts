export { default } from "next-auth/middleware"

export const config = { matcher: ["/profile", "/blog/:path*", "/api/blog/:path"] }
