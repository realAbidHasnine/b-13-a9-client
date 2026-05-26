import { NextResponse } from "next/server";

// Define which routes should be protected from unauthenticated users
const protectedRoutes = ["/create", "/profile"];

export async function proxy(request) {  const { pathname } = request.nextUrl;
  

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (isProtected) {
    try {

      const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      const session = await res.json();
      
      if (!session) {
        // Redirect to login and preserve the original destination
        const url = new URL("/login", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Middleware session check failed:", error);
      // Fail securely
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // 2. Prevent authenticated users from visiting the login/register pages
  if (pathname === "/login" || pathname === "/register") {
      try {
        const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });
        
        const session = await res.json();
        
        if (session) {
            return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
          // Ignore error on public routes
      }
  }

  // 3. Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};