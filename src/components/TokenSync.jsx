"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function TokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Get the backend URL from environment or use default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // User is logged in via Better Auth, fetch the backend JWT token
      fetch(`${apiUrl}/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: session.user.email,
          name: session.user.name,
          image: session.user.image
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("access_token", data.token);
          }
        })
        .catch((err) => console.error("Failed to sync token", err));
    } else if (session === null) {
      // User is logged out
      localStorage.removeItem("access_token");
    }
  }, [session]);

  return null;
}