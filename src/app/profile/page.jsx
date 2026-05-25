"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/utils/apiFetch";
import PrivateRoute from "@/components/PrivateRoute";
import { toast } from "react-toastify";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";

function ProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = "IdeaVault | My Profile";
    if (user) {
      setName(user.name || "");
      setPhotoURL(user.image || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data, error } = await authClient.updateUser({
        name,
        image: photoURL || undefined,
      });

      if (error) throw new Error(error.message);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="py-16 bg-zinc-50 dark:bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      <div className="card-container w-full max-w-[480px]">
        {/* Display section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden mb-4 relative shadow-md ring-4 ring-white dark:ring-zinc-900">
            {photoURL || user?.image ? (
              <Image
                src={photoURL || user?.image}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-bold text-3xl">
                {name.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {user?.name}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            {user?.email}
          </p>
        </div>

        {/* Edit form */}
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              disabled
              className="input-field bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed opacity-70"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full btn-primary mt-4"
          >
            {updating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}