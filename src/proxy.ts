import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { sanitizeAdminRedirect } from "@/lib/auth/sanitize-redirect";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL("/login", request.url);
    const path =
      request.nextUrl.pathname +
      (request.nextUrl.search ? request.nextUrl.search : "");
    login.searchParams.set("redirectTo", sanitizeAdminRedirect(path));
    return NextResponse.redirect(login);
  }

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!coach) {
    return NextResponse.redirect(new URL("/login/not-a-coach", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
