"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiFetch";
import PrivateRoute from "@/components/PrivateRoute";
import IdeaCard from "@/components/IdeaCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { MessageCircle } from "lucide-react";

function MyInteractionsContent() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "IdeaVault | My Interactions";
    async function fetchInteractions() {
      try {
        // The backend /my-interactions returns the user's comments.
        // We need to extract the unique ideaIds and fetch the corresponding ideas.
        const commentsData = await apiFetch("/my-interactions");
        const comments = Array.isArray(commentsData) ? commentsData : [];

        const uniqueIdeaIds = [
          ...new Set(comments.map((c) => c.ideaId).filter(Boolean)),
        ];

        const ideasPromises = uniqueIdeaIds.map(
          (id) => apiFetch(`/ideas/${id}`).catch(() => null), // ignore 404s for deleted ideas
        );

        const resolvedIdeas = await Promise.all(ideasPromises);
        setInteractions(resolvedIdeas.filter((idea) => idea !== null));
      } catch (error) {
        console.error("Failed to fetch interactions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInteractions();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8">My Interactions</h1>

      {interactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {interactions.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageCircle}
          title="No interactions yet"
          message="You haven't interacted with any ideas yet."
          actionText="Explore Ideas"
          actionHref="/ideas"
        />
      )}
    </div>
  );
}

export default function MyInteractionsPage() {
  return (
    <PrivateRoute>
      <MyInteractionsContent />
    </PrivateRoute>
  );
}