export { default } from "next-auth/middleware"

export const config = { matcher: ["/profile", "/post/edit/:path*", "/post/create"] }
