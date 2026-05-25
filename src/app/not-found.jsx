import Link from "next/link";
import { Compass } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <EmptyState
          icon={Compass}
          title="404 - Page Not Found"
          message="We couldn't find the page you're looking for. The idea might have been moved or deleted."
          actionText="Return Home"
          actionHref="/"
        />
      </div>
    </div>
  );
}