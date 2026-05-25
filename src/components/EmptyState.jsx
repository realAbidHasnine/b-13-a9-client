import { Inbox } from "lucide-react";
import Link from "next/link";

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  message = "There's nothing to show here right now.",
  actionText,
  actionHref
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 mb-6">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">{message}</p>
      
      {actionText && actionHref && (
        <Link href={actionHref} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}