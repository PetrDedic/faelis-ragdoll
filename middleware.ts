import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const { data } = await supabase.auth.getUser();

  const isAuthenticated = !!data?.user;
  const protectedPaths = ["/admin", "/admin/"];

  console.log(isAuthenticated);

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const url = new URL("/login", req.nextUrl.origin);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
