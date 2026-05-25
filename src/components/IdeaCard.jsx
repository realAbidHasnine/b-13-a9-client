import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, User } from "lucide-react";

export default function IdeaCard({ idea }) {
  const title = idea.ideaTitle || "Untitled Idea";
  const desc = idea.shortDescription || "";
  const category = idea.category || "Uncategorized";
  const authorName = idea.userName || "Anonymous";
  const date = idea.createdAt ? new Date(idea.createdAt) : (idea._id ? new Date(parseInt(idea._id.substring(0, 8), 16) * 1000) : new Date());

  return (
    <div className="card-container flex flex-col h-full relative">
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-500/20">
          {category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 line-clamp-1">
        {title}
      </h3>
      
      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 flex-grow mb-6">
        {desc}
      </p>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800 mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/ideas/${idea._id}`} className="btn-outline w-full group">
          View Details
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}