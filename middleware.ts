import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the request origin
  const origin = request.headers.get("origin");

  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:5173", // Development origin
    "https://resume-dashboard-ten.vercel.app", // Add your additional origin here
  ];

  // Determine the CORS origin (only allow if the request origin is in allowedOrigins)
  const corsOrigin = allowedOrigins.includes(origin) ? origin : null;

  // Get the response we're going to send
  const response = NextResponse.next();

  // Add the CORS headers to the response if the origin is allowed
  if (corsOrigin) {
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true"); // Support credentials
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    if (corsOrigin) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    } else {
      // Optionally, reject unauthorized origins
      return new NextResponse(null, { status: 403 });
    }
  }

  return response;
}

// Apply this middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
