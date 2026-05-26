import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, User } from "lucide-react";

export default function IdeaCard({ idea }) {
  const [imgError, setImgError] = useState(false);

  const title = idea.ideaTitle || "Untitled Idea";
  const desc = idea.shortDescription || "";
  const category = idea.category || "Uncategorized";
  const authorName = idea.userName || "Anonymous";
  const date = idea.createdAt
    ? new Date(idea.createdAt)
    : idea._id
    ? new Date(parseInt(idea._id.substring(0, 8), 16) * 1000)
    : new Date();
  const hasBgImage = idea.imageURL && !imgError;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .idea-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
          background: #fff;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
          cursor: pointer;
        }

        .dark .idea-card {
          background: #141414;
          border-color: rgba(255,255,255,0.07);
        }

        .idea-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .dark .idea-card:hover {
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
        }

        .idea-card-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          user-select: none;
        }

        .idea-card-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
          transition: transform 0.7s ease-out, opacity 0.35s ease;
          transform: scale(1.0);
        }

        .idea-card:hover .idea-card-bg img {
          transform: scale(1.06);
          opacity: 0.45;
        }

        .idea-card-bg-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0.88) 100%);
        }

        .dark .idea-card-bg-fade {
          background: linear-gradient(160deg, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.55) 55%, rgba(20,20,20,0.82) 100%);
        }

        .idea-card-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
        }

        .idea-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 1.1rem;
        }

        .idea-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.07);
          border: 1px solid rgba(99, 102, 241, 0.15);
          padding: 4px 11px;
          border-radius: 100px;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }

        .dark .idea-category {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .idea-card:hover .idea-category {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.25);
        }

        .idea-corner-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.25);
          flex-shrink: 0;
          margin-top: 6px;
          transition: background 0.25s, transform 0.25s;
        }

        .idea-card:hover .idea-corner-dot {
          background: #6366f1;
          transform: scale(1.4);
        }

        .idea-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 400;
          line-height: 1.35;
          color: #111;
          margin: 0 0 0.55rem;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.01em;
        }

        .dark .idea-title {
          color: #f5f5f5;
        }

        .idea-desc {
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.65;
          color: #666;
          margin: 0;
          flex-grow: 1;
          margin-bottom: 1.4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dark .idea-desc {
          color: #999;
        }

        .idea-card-footer {
          margin-top: auto;
        }

        .idea-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          font-weight: 400;
          color: #999;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .dark .idea-meta {
          color: #666;
          border-bottom-color: rgba(255,255,255,0.06);
        }

        .idea-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .idea-meta-item svg {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
        }

        .idea-meta-author {
          font-weight: 500;
          color: #555;
        }

        .dark .idea-meta-author {
          color: #aaa;
        }

        .idea-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: #3730a3;
          background: rgba(99, 102, 241, 0.07);
          border: 1px solid rgba(99, 102, 241, 0.15);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
        }

        .dark .idea-link {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.18);
        }

        .idea-link:hover {
          background: rgba(99, 102, 241, 0.13);
          border-color: rgba(99, 102, 241, 0.3);
          color: #4338ca;
        }

        .dark .idea-link:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          color: #c7d2fe;
        }

        .idea-link-arrow {
          display: inline-block;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .idea-link:hover .idea-link-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <div
        className="idea-card group"
        style={
          hasBgImage
            ? {
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }
            : {}
        }
      >
        {hasBgImage && (
          <div className="idea-card-bg">
            <img
              src={idea.imageURL}
              alt={title}
              onError={() => setImgError(true)}
            />
            <div className="idea-card-bg-fade" />
          </div>
        )}

        <div className="idea-card-inner">
          <div className="idea-card-top">
            <span className="idea-category">{category}</span>
            <div className="idea-corner-dot" />
          </div>

          <h3 className="idea-title">{title}</h3>

          <p className="idea-desc">{desc}</p>

          <div className="idea-card-footer">
            <div className="idea-meta">
              <span className="idea-meta-item idea-meta-author">
                <User className="w-3.5 h-3.5" />
                {authorName}
              </span>
              <span className="idea-meta-item">
                <Clock className="w-3.5 h-3.5" />
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            </div>

            <Link href={`/ideas/${idea._id}`} className="idea-link">
              View Details
              <span className="idea-link-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}