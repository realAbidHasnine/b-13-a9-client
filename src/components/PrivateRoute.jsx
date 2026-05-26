"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login if not authenticated
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [session, isPending, router, pathname]);

  useEffect(() => {
    if (session) {
      let attempts = 0;
      const checkToken = () => {
        if (localStorage.getItem("access_token") || attempts > 50) { // max 5 seconds wait
          setTokenReady(true);
        } else {
          attempts++;
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    }
  }, [session]);

  if (isPending || (session && !tokenReady)) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}