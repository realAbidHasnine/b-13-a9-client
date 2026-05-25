"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiFetch";
import IdeaCard from "@/components/IdeaCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Search, Filter, Sparkles } from "lucide-react";

export default function ExploreIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "All",
    "Tech",
    "Health",
    "AI",
    "Education",
    "Environment",
    "Finance",
    "Social",
    "Entertainment",
    "Other",
  ];

  const fetchIdeas = async (currentSearch = search, currentCat = category) => {
    setLoading(true);
    try {
      let url = "/ideas";
      const params = new URLSearchParams();
      if (currentSearch) params.append("search", currentSearch);
      if (currentCat && currentCat !== "All")
        params.append("category", currentCat);
      if (params.toString()) url += `?${params.toString()}`;

      const data = await apiFetch(url);
      setIdeas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "IdeaVault | Explore Ideas";
    (async () => {
      await fetchIdeas();
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIdeas();
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    fetchIdeas(search, cat);
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Explore All Ideas
            </h1>
            {!loading && (
              <p className="text-zinc-500 font-medium">
                Showing {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full md:w-auto relative max-w-md flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 rounded-full"
              />
            </div>
            <button type="submit" className="btn-primary rounded-full shrink-0">
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mr-2 shrink-0">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 border ${
                category === cat || (!category && cat === "All")
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-600 dark:hover:border-indigo-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No ideas yet"
            message={
              search || (category && category !== "All")
                ? "We couldn't find any ideas matching your current filters."
                : "Be the first to share an idea!"
            }
            actionText="Share an Idea"
            actionHref="/add-idea"
          />
        )}
      </div>
    </div>
  );
}