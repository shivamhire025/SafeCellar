import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/chemicals",
  "/deliveries",
  "/sds-review",
  "/incidents",
  "/workers",
  "/settings",
];
const AUTH_ROUTES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isProtected = PROTECTED_ROUTES.some((r) =>
    request.nextUrl.pathname.startsWith(r)
  );
  const isAuth = AUTH_ROUTES.some((r) =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (isDemoMode()) {
    const demoSession = request.cookies.get("safecellar-demo-session");
    if (isProtected && !demoSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isAuth && demoSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuth && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
