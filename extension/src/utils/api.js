const BASE_URL = "http://localhost:8000";

// Internal cache to prevent redundant network calls and latency
const responseCache = new Map();
const indexCache = new Set();

export const api = {
  // --------------------------------------------------
  // Index page content - Optimized with Cache
  // --------------------------------------------------
  indexPage: async (url, text) => {
    // Zero-latency check: If URL is already indexed, don't hit the server
    if (indexCache.has(url)) {
      console.log("CACHE_HIT: Page already indexed");
      return { status: "already_indexed" };
    }

    try {
      const res = await fetch(`${BASE_URL}/index`, {
        method: "POST", // Strictly POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, text })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "INDEXING_FAILED");
      }

      indexCache.add(url);
      return data;
    } catch (error) {
      console.error("CRITICAL_INDEX_ERROR:", error);
      throw error;
    }
  },

  // --------------------------------------------------
  // Chat with indexed page - Method Corrected & Optimized
  // --------------------------------------------------
  chat: async (url, query) => {
    const cacheKey = `${url}:${query}`;

    // Instant Response: Avoid latency for repeated questions
    if (responseCache.has(cacheKey)) {
      console.log("CACHE_HIT: Returning cached response");
      return responseCache.get(cacheKey);
    }

    try {
      // 🔑 ENSURING POST METHOD TO AVOID 405 ERRORS
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, query })
      });

      // Handle cases where the backend might return 405 or 500
      if (res.status === 405) {
        return "SYSTEM_ERROR: Method Not Allowed. Check server configuration.";
      }

      const data = await res.json();

      if (data?.reply) {
        // Remove unwanted formatting characters (like *) before caching
        const cleanReply = data.reply.replace(/\*/g, "").trim();
        responseCache.set(cacheKey, cleanReply);
        return cleanReply;
      }

      return "NEURAL_LINK_FAILED: No response content.";
    } catch (error) {
      console.error("NETWORK_FAILURE:", error);
      // This triggers the "Something went wrong" in your Chat.jsx catch block
      throw new Error("COMMUNICATION_TIMEOUT");
    }
  },

  clearSession: () => {
    responseCache.clear();
    indexCache.clear();
    console.log("SESSION_WIPED");
  }
};