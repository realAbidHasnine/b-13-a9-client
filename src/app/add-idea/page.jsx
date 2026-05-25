"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/apiFetch";
import PrivateRoute from "@/components/PrivateRoute";
import { toast } from "react-toastify";
import {
  Loader2,
  Send,
  Lightbulb,
  Image as ImageIcon,
  Briefcase,
  FileText,
  Target,
  DollarSign,
  X,
} from "lucide-react";

function CreateIdeaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [formData, setFormData] = useState({
    ideaTitle: "",
    shortDescription: "",
    detailedDescription: "",
    category: "Tech",
    tags: [],
    imageURL: "",
    estimatedBudget: "",
    targetAudience: "",
    problemStatement: "",
    proposedSolution: "",
  });

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

  useEffect(() => {
    document.title = "IdeaVault | Share Your Idea";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);
    const splitTags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: splitTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/ideas", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // Redirect to the new idea page
      toast.success("Your idea has been submitted!");
      if (data && data.insertedId) {
        router.push(`/ideas/${data.insertedId}`);
      } else {
        router.push("/ideas");
      }
    } catch (error) {
      toast.error("Failed to submit idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Lightbulb size={24} />
            </div>
            Submit New Idea
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Share your vision with the community. Fill out the details below to
            publish your idea.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card-container p-6 md:p-8 space-y-6">
            {/* Basic Info */}
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-zinc-100">
              <Briefcase className="w-5 h-5 text-indigo-500" /> Basic
              Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Idea Title *
                </label>
                <input
                  type="text"
                  name="ideaTitle"
                  required
                  value={formData.ideaTitle}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. AI-Powered Crop Monitoring"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="input-field resize-y"
                  placeholder="A quick summary of your idea..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
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
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                    <ImageIcon className="w-4 h-4 text-zinc-400" /> Cover Image
                    URL
                  </label>
                  <input
                    type="url"
                    name="imageURL"
                    value={formData.imageURL}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-container p-6 md:p-8 space-y-6">
            {/* Detailed Pitch */}
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-zinc-100">
              <FileText className="w-5 h-5 text-purple-500" /> The Pitch
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Problem Statement *
                </label>
                <textarea
                  name="problemStatement"
                  required
                  rows={3}
                  value={formData.problemStatement}
                  onChange={handleChange}
                  className="input-field resize-y"
                  placeholder="What problem are you solving?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Proposed Solution *
                </label>
                <textarea
                  name="proposedSolution"
                  required
                  rows={3}
                  value={formData.proposedSolution}
                  onChange={handleChange}
                  className="input-field resize-y"
                  placeholder="How does your idea solve the problem?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Detailed Description *
                </label>
                <textarea
                  name="detailedDescription"
                  required
                  rows={5}
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  className="input-field resize-y"
                  placeholder="Provide a comprehensive overview of your project..."
                />
              </div>
            </div>
          </div>

          <div className="card-container p-6 md:p-8 space-y-6">
            {/* Logistics */}
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-zinc-100">
              <Target className="w-5 h-5 text-emerald-500" /> Target & Logistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                  Target Audience *
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  required
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Farmers, Students"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                  <DollarSign className="w-4 h-4 text-zinc-400" /> Estimated
                  Budget (USD)
                </label>
                <input
                  type="number"
                  name="estimatedBudget"
                  min="0"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                className="input-field"
                placeholder="e.g. AI, agriculture, drones"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 text-xs rounded-lg flex items-center gap-1 font-medium"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 cursor-pointer"
                        onClick={() => {
                          const newTags = formData.tags.filter(
                            (_, idx) => idx !== i,
                          );
                          setFormData((prev) => ({ ...prev, tags: newTags }));
                          setTagsInput(newTags.join(", "));
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              Publish Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateIdeaPage() {
  return (
    <PrivateRoute>
      <CreateIdeaForm />
    </PrivateRoute>
  );
}