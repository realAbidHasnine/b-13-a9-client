const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  // Get the custom access token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = { 
    "Content-Type": "application/json", 
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers 
  };

  const res = await fetch(`${API}${path}`, { 
    cache: "no-store",
    ...options, 
    headers
  });
  
  // Handle empty responses (like 204 No Content)
  let data;
  try {
    data = await res.json();
  } catch (error) {
    data = {}; // If it's not JSON, just return empty object
  }

  if (!res.ok) {
    const errorMsg = typeof data?.error === "string" 
      ? data.error 
      : (data?.message || "Request failed");
    throw new Error(errorMsg);
  }
  
  return data;
}