"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/utils/apiFetch";
import PrivateRoute from "@/components/PrivateRoute";
import IdeaCard from "@/components/IdeaCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { toast } from "react-toastify";
import { Sparkles, Edit3, Trash2, X, Save, AlertTriangle } from "lucide-react";

function EditIdeaModal({ idea, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...idea });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Tech",
    "Health",
    "AI",
    "Education",
    "Finance",
    "Environment",
    "Social",
    "Entertainment",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch(`/ideas/${idea._id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      toast.success("Idea updated successfully!");
      onSave(); // Refresh list & show toast in parent
    } catch (err) {
      toast.error("Failed to update idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">Edit Idea</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Idea Title
            </label>
            <input
              type="text"
              name="ideaTitle"
              required
              value={formData.ideaTitle || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              required
              rows={2}
              value={formData.shortDescription || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Detailed Description
            </label>
            <textarea
              name="detailedDescription"
              required
              rows={4}
              value={formData.detailedDescription || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category || "Tech"}
                onChange={handleChange}
                className="input-field appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                name="imageURL"
                value={formData.imageURL || ""}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Problem Statement
            </label>
            <textarea
              name="problemStatement"
              required
              rows={2}
              value={formData.problemStatement || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Proposed Solution
            </label>
            <textarea
              name="proposedSolution"
              required
              rows={2}
              value={formData.proposedSolution || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ ideaTitle, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="card-container max-w-sm w-full text-center relative p-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Delete Idea?</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
          Are you sure you want to delete &apos;{ideaTitle}&apos;? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-danger flex-1"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MyIdeasContent() {
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingIdea, setEditingIdea] = useState(null);
  const [deletingIdea, setDeletingIdea] = useState(null);

  const fetchIdeas = useCallback(async () => {
    try {
      const data = await apiFetch("/my-ideas");
      setMyIdeas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch ideas", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "IdeaVault | My Ideas";
    (async () => {
      await fetchIdeas();
    })();
  }, [fetchIdeas]);

  const handleDelete = async () => {
    try {
      await apiFetch(`/ideas/${deletingIdea._id}`, { method: "DELETE" });
      setDeletingIdea(null);
      toast.success("Idea deleted.");
      fetchIdeas();
    } catch (err) {
      toast.error("Failed to delete idea.");
    }
  };

  const handleSaveEdit = () => {
    setEditingIdea(null);
    fetchIdeas();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8">My Ideas</h1>

      {myIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {myIdeas.map((idea) => (
            <div key={idea._id} className="flex flex-col h-full">
              <div className="flex-1">
                <IdeaCard idea={idea} />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditingIdea(idea)}
                  className="btn-outline flex-1 text-sm py-1.5"
                >
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit
                </button>
                <button
                  onClick={() => setDeletingIdea(idea)}
                  className="btn-outline flex-1 text-sm py-1.5 text-red-600! border-red-600! hover:bg-red-600! hover:text-white! dark:text-red-400! dark:border-red-400! dark:hover:bg-red-500!"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No ideas yet"
          message="You haven't posted any ideas yet."
          actionText="Add Your First Idea →"
          actionHref="/add-idea"
        />
      )}

      {editingIdea && (
        <EditIdeaModal
          idea={editingIdea}
          onClose={() => setEditingIdea(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingIdea && (
        <DeleteConfirmModal
          ideaTitle={deletingIdea.ideaTitle}
          onClose={() => setDeletingIdea(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default function MyIdeasPage() {
  return (
    <PrivateRoute>
      <MyIdeasContent />
    </PrivateRoute>
  );
}