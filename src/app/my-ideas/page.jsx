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
      onSave();
    } catch (err) {
      toast.error("Failed to update idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .edit-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: em-overlayIn 0.2s ease;
        }
        @keyframes em-overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .edit-modal-panel {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          background: #0d0d10;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0,0,0,0.7),
            0 0 80px rgba(99,102,241,0.07);
          animation: em-panelIn 0.28s cubic-bezier(0.34,1.4,0.64,1);
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        /* Light-mode override */
        :root:not(.dark) .edit-modal-panel {
          background: #fafafa;
          border-color: rgba(0,0,0,0.07);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.03) inset,
            0 32px 64px rgba(0,0,0,0.12),
            0 0 60px rgba(99,102,241,0.05);
        }
        @keyframes em-panelIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        /* ── Header ────────────────────────────────── */
        .edit-modal-header {
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 1.5rem 1.75rem 1.25rem;
          background: #0d0d10;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        :root:not(.dark) .edit-modal-header {
          background: #fafafa;
          border-bottom-color: rgba(0,0,0,0.06);
        }
        .edit-modal-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #818cf8;
          margin-bottom: 5px;
        }
        .edit-modal-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.65rem;
          font-weight: 400;
          line-height: 1.1;
          color: #f1f1f3;
          letter-spacing: -0.01em;
        }
        :root:not(.dark) .edit-modal-title { color: #18181b; }
        .edit-modal-subtitle {
          font-size: 12px;
          color: rgba(161,161,170,0.6);
          margin-top: 5px;
          font-weight: 300;
        }
        :root:not(.dark) .edit-modal-subtitle { color: #71717a; }

        .edit-modal-close {
          flex-shrink: 0;
          margin-top: 3px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #71717a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .edit-modal-close:hover {
          background: rgba(255,255,255,0.09);
          color: #e4e4e7;
          border-color: rgba(255,255,255,0.14);
        }
        :root:not(.dark) .edit-modal-close {
          border-color: rgba(0,0,0,0.1);
          background: rgba(0,0,0,0.03);
          color: #71717a;
        }
        :root:not(.dark) .edit-modal-close:hover {
          background: rgba(0,0,0,0.08);
          color: #18181b;
        }

        /* ── Form body ─────────────────────────────── */
        .edit-modal-body {
          padding: 0.25rem 1.75rem 0.5rem;
          display: flex;
          flex-direction: column;
        }
        .edit-section {
          padding: 1.2rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.045);
        }
        :root:not(.dark) .edit-section { border-bottom-color: rgba(0,0,0,0.055); }
        .edit-section:last-child { border-bottom: none; }

        .edit-section-label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #818cf8;
          margin-bottom: 9px;
        }

        /* ── Fields ────────────────────────────────── */
        .edit-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #e4e4e7;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
          resize: vertical;
          line-height: 1.6;
          outline: none;
          box-sizing: border-box;
        }
        .edit-field::placeholder { color: rgba(113,113,122,0.55); }
        .edit-field:hover {
          border-color: rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.06);
        }
        .edit-field:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.13);
        }
        :root:not(.dark) .edit-field {
          background: #f4f4f6;
          border-color: rgba(0,0,0,0.09);
          color: #18181b;
        }
        :root:not(.dark) .edit-field::placeholder { color: #a1a1aa; }
        :root:not(.dark) .edit-field:hover {
          border-color: rgba(0,0,0,0.16);
          background: #ededef;
        }
        :root:not(.dark) .edit-field:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .edit-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* ── Footer ────────────────────────────────── */
        .edit-modal-footer {
          position: sticky;
          bottom: 0;
          padding: 1.1rem 1.75rem;
          background: #0d0d10;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: flex-end;
          gap: 0.65rem;
          align-items: center;
        }
        :root:not(.dark) .edit-modal-footer {
          background: #fafafa;
          border-top-color: rgba(0,0,0,0.06);
        }

        .edit-btn-cancel {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8.5px 18px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.09);
          background: transparent;
          color: #71717a;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.01em;
        }
        .edit-btn-cancel:hover {
          background: rgba(255,255,255,0.06);
          color: #d4d4d8;
          border-color: rgba(255,255,255,0.15);
        }
        :root:not(.dark) .edit-btn-cancel {
          border-color: rgba(0,0,0,0.11);
          color: #71717a;
        }
        :root:not(.dark) .edit-btn-cancel:hover {
          background: rgba(0,0,0,0.05);
          color: #18181b;
        }

        .edit-btn-save {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 8.5px 20px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.18s ease;
          box-shadow: 0 2px 14px rgba(99,102,241,0.38);
          letter-spacing: 0.01em;
        }
        .edit-btn-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 22px rgba(99,102,241,0.52);
        }
        .edit-btn-save:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(99,102,241,0.3);
        }
        .edit-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        .edit-saving-dot {
          display: inline-flex;
          gap: 3px;
          align-items: center;
        }
        .edit-saving-dot span {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          animation: em-bounce 1.1s infinite;
        }
        .edit-saving-dot span:nth-child(2) { animation-delay: 0.18s; }
        .edit-saving-dot span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes em-bounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.5; }
          40%            { transform: translateY(-4px); opacity: 1;   }
        }
      `}</style>

      <div className="edit-modal-overlay">
        <div className="edit-modal-panel">

          {/* ── Header ── */}
          <div className="edit-modal-header">
            <div>
              <p className="edit-modal-eyebrow">IdeaVault</p>
              <h2 className="edit-modal-title">Edit Idea</h2>
              <p className="edit-modal-subtitle">Polish your idea — every detail matters.</p>
            </div>
            <button onClick={onClose} className="edit-modal-close" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="edit-modal-body">

              <div className="edit-section">
                <label className="edit-section-label">Idea Title</label>
                <input
                  type="text"
                  name="ideaTitle"
                  required
                  value={formData.ideaTitle || ""}
                  onChange={handleChange}
                  className="edit-field"
                  placeholder="Give your idea a memorable name…"
                />
              </div>

              <div className="edit-section">
                <label className="edit-section-label">Short Description</label>
                <textarea
                  name="shortDescription"
                  required
                  rows={2}
                  value={formData.shortDescription || ""}
                  onChange={handleChange}
                  className="edit-field"
                  placeholder="One or two sentences that capture the essence…"
                />
              </div>

              <div className="edit-section">
                <label className="edit-section-label">Detailed Description</label>
                <textarea
                  name="detailedDescription"
                  required
                  rows={4}
                  value={formData.detailedDescription || ""}
                  onChange={handleChange}
                  className="edit-field"
                  placeholder="Expand on the idea in full depth…"
                />
              </div>

              <div className="edit-section">
                <div className="edit-grid-2">
                  <div>
                    <label className="edit-section-label">Category</label>
                    <select
                      name="category"
                      value={formData.category || "Tech"}
                      onChange={handleChange}
                      className="edit-field appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="edit-section-label">Image URL</label>
                    <input
                      type="url"
                      name="imageURL"
                      value={formData.imageURL || ""}
                      onChange={handleChange}
                      className="edit-field"
                      placeholder="https://…"
                    />
                  </div>
                </div>
              </div>

              <div className="edit-section">
                <label className="edit-section-label">Problem Statement</label>
                <textarea
                  name="problemStatement"
                  required
                  rows={2}
                  value={formData.problemStatement || ""}
                  onChange={handleChange}
                  className="edit-field"
                  placeholder="What pain point does this solve?"
                />
              </div>

              <div className="edit-section">
                <label className="edit-section-label">Proposed Solution</label>
                <textarea
                  name="proposedSolution"
                  required
                  rows={2}
                  value={formData.proposedSolution || ""}
                  onChange={handleChange}
                  className="edit-field"
                  placeholder="How exactly does your idea address it?"
                />
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="edit-modal-footer">
              <button type="button" onClick={onClose} className="edit-btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="edit-btn-save">
                {loading ? (
                  <>
                    Saving
                    <span className="edit-saving-dot">
                      <span /><span /><span />
                    </span>
                  </>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
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