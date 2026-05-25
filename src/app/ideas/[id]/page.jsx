"use client";

import { useState, useEffect, use } from "react";
import { apiFetch } from "@/utils/apiFetch";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import PrivateRoute from "@/components/PrivateRoute";
import { toast } from "react-toastify";

function IdeaDetailsContent({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ideaData, commentsData] = await Promise.all([
        apiFetch(`/ideas/${id}`),
        apiFetch(`/comments/${id}`).catch(() => []),
      ]);
      setIdea(ideaData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
      if (ideaData?.ideaTitle) {
        document.title = `IdeaVault | ${ideaData.ideaTitle}`;
      }
    } catch (err) {
      setError("Failed to load idea details. It might have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        await fetchData();
      })();
    }
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      router.push(`/login?redirect=/ideas/${id}`);
      return;
    }

    setSubmitting(true);
    try {
      const newComment = await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
          text: commentText,
          ideaId: id,
        }),
      });
      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await apiFetch(`/comments/${commentId}`, { method: "DELETE" });
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error("Failed to delete comment.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      setEditingCommentId(null);
      return;
    }
    try {
      const updated = await apiFetch(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ text: editingCommentText }),
      });
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, text: editingCommentText } : c,
        ),
      );
      setEditingCommentId(null);
      toast.success("Comment updated!");
    } catch (err) {
      toast.error("Failed to update comment.");
    }
  };

  const handleDeleteIdea = async () => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      await apiFetch(`/ideas/${id}`, { method: "DELETE" });
      toast.success("Idea deleted.");
      router.push("/ideas");
    } catch (err) {
      toast.error("Failed to delete idea.");
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !idea) {
    return (
      <div className="py-20 flex flex-col items-center">
        <ErrorMessage message={error || "Idea not found"} onRetry={fetchData} />
        <Link href="/ideas" className="btn-outline mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Ideas
        </Link>
      </div>
    );
  }

  const date = idea.createdAt
    ? new Date(idea.createdAt)
    : idea._id
      ? new Date(parseInt(idea._id.substring(0, 8), 16) * 1000)
      : new Date();
  const isOwner = user && idea.authorId === user.userId;
  const authorName = idea.userName || "Anonymous";

  return (
    <div className="py-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-container p-0 overflow-hidden">
              {idea.imageURL && (
                <div className="relative w-full h-64 md:h-80 bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={idea.imageURL}
                    alt={idea.ideaTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-semibold rounded-full border border-indigo-100 dark:border-indigo-500/20">
                    {idea.category || "Uncategorized"}
                  </span>
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteIdea}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete Idea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">
                  {idea.ideaTitle}
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400">
                  {idea.shortDescription}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="card-container p-0">
              <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
                {["overview", "problem", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                        : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    {tab === "problem" ? "Problem & Solution" : tab}
                  </button>
                ))}
              </div>

              <div className="p-8 prose prose-zinc dark:prose-invert max-w-none">
                {activeTab === "overview" && (
                  <div className="animate-in fade-in">
                    <h3 className="text-xl font-bold mb-4">Summary</h3>
                    <p className="whitespace-pre-wrap">
                      {idea.shortDescription}
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4">
                      Target Audience
                    </h3>
                    <p>{idea.targetAudience || "Not specified"}</p>
                  </div>
                )}
                {activeTab === "problem" && (
                  <div className="animate-in fade-in">
                    <h3 className="text-xl font-bold mb-4">The Problem</h3>
                    <p className="whitespace-pre-wrap">
                      {idea.problemStatement || "Not specified"}
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4">
                      Proposed Solution
                    </h3>
                    <p className="whitespace-pre-wrap">
                      {idea.proposedSolution || "Not specified"}
                    </p>
                  </div>
                )}
                {activeTab === "details" && (
                  <div className="animate-in fade-in">
                    <h3 className="text-xl font-bold mb-4">
                      Detailed Description
                    </h3>
                    <p className="whitespace-pre-wrap">
                      {idea.detailedDescription ||
                        "No further details provided."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="card-container">
              <h2 className="text-2xl font-bold mb-8">
                Discussion ({comments.length})
              </h2>

              <form onSubmit={handlePostComment} className="mb-10 relative">
                {!user && (
                  <div className="absolute inset-0 z-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <Link
                      href={`/login?redirect=/ideas/${id}`}
                      className="btn-primary shadow-lg hover:scale-105 transition-transform"
                    >
                      Sign in to comment
                    </Link>
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What do you think about this idea?"
                  className="input-field min-h-[120px] resize-y"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {comments.map((comment) => {
                  const isCommentOwner =
                    user &&
                    (comment.userId === user.userId ||
                      comment.userEmail === user.email);
                  return (
                    <div
                      key={comment._id}
                      className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                        {comment.userPhotoURL ? (
                          <Image
                            src={comment.userPhotoURL}
                            alt={comment.userName}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-indigo-600 font-bold text-sm">
                            {comment.userName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {comment.userName || "Anonymous User"}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-500">
                              {comment.time
                                ? formatDistanceToNow(new Date(comment.time), {
                                    addSuffix: true,
                                  })
                                : "Just now"}
                            </span>
                            {isCommentOwner && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingCommentText(comment.text);
                                  }}
                                  className="text-zinc-400 hover:text-indigo-600 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) =>
                                setEditingCommentText(e.target.value)
                              }
                              className="input-field w-full min-h-[80px] resize-y mb-2 text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-200 dark:bg-zinc-800 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm mt-2">
                            {comment.text}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="card-container">
              <h3 className="font-semibold text-lg mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    {authorName}
                  </p>
                  <p className="text-sm text-zinc-500">Innovator</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Clock className="w-4 h-4" />
                Posted {formatDistanceToNow(date, { addSuffix: true })}
              </div>
            </div>

            <div className="card-container">
              <h3 className="font-semibold text-lg mb-4">Idea Meta</h3>
              <div className="space-y-4">
                {idea.estimatedBudget && (
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Estimated Budget
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      ${Number(idea.estimatedBudget).toLocaleString()}
                    </span>
                  </div>
                )}
                {idea.tags && idea.tags.length > 0 && (
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs rounded-md text-zinc-600 dark:text-zinc-400 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IdeaDetailsPage({ params }) {
  return (
    <PrivateRoute>
      <IdeaDetailsContent params={params} />
    </PrivateRoute>
  );
}