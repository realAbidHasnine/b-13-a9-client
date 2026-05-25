"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/apiFetch";
import IdeaCard from "@/components/IdeaCard";
import HeroSlider from "@/components/HeroSlider";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  UserPlus,
  Lightbulb,
  MessageCircle,
  Globe,
  Lock,
  Zap,
  Rocket,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "IdeaVault | Home";
  }, []);

  useEffect(() => {
    async function loadTrending() {
      try {
        const data = await apiFetch("/ideas?limit=6");
        const sorted = (Array.isArray(data) ? data : []).reverse().slice(0, 6);
        setIdeas(sorted);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />

      {/* Trending Ideas Section */}
      <section className="py-16 px-4 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Trending Ideas
              </h2>
              <p className="text-zinc-500 mt-2">
                Discover the most popular concepts right now.
              </p>
            </div>
            <Link
              href="/ideas"
              className="hidden md:flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : ideas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 mb-4">No trending ideas found yet.</p>
              <Link href="/add-idea" className="btn-primary inline-flex">
                Share the First Idea
              </Link>
            </div>
          )}

          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/ideas" className="btn-outline">
              View All Ideas
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center mb-6 relative">
                <UserPlus size={32} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Create your free account in seconds and join the community.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center mb-6 relative">
                <Lightbulb size={32} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Ideas</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Post your startup concept with full details and goals.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center mb-6 relative">
                <MessageCircle size={32} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Receive comments, validate ideas, and build your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why IdeaVault Section */}
      <section className="py-16 px-4 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why IdeaVault?
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              We provide the perfect environment to nurture your next big
              venture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-container text-center flex flex-col items-center">
              <Globe className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Global Community</h3>
              <p className="text-sm text-zinc-500">
                Connect with founders and innovators from all over the world.
              </p>
            </div>
            <div className="card-container text-center flex flex-col items-center">
              <Lock className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
              <p className="text-sm text-zinc-500">
                Your data and communications are always kept safe and secure.
              </p>
            </div>
            <div className="card-container text-center flex flex-col items-center">
              <Zap className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Get Inspired</h3>
              <p className="text-sm text-zinc-500">
                Discover groundbreaking trends and unique solutions daily.
              </p>
            </div>
            <div className="card-container text-center flex flex-col items-center">
              <Rocket className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Launch Faster</h3>
              <p className="text-sm text-zinc-500">
                Validate your product quickly and accelerate your go-to-market.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}