import { useState, useEffect, useRef } from "react";
import { api } from "../../utils/api";

export default function Chat({ isReady, pageUrl }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatResponse = (text) => {
    if (!text) return "No response data received.";
    // Ensure we are working with a string to avoid .replace errors
    const content = typeof text === "string" ? text : JSON.stringify(text);
    return content.replace(/\*/g, "").trim();
  };

  const simulateStreaming = (fullText, placeholderId) => {
    let currentText = "";
    const words = fullText.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === placeholderId ? { ...msg, text: currentText, isTyping: false } : msg
          )
        );
        i++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 1);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [id]: false }));
    }, 300);
  };

  const ask = async () => {
    if (!pageUrl || !input.trim() || loading) return;

    const userMessage = { role: "user", text: input, id: Date.now() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    const placeholderId = Date.now() + 1;
    setMessages((m) => [...m, { role: "assistant", text: "●", id: placeholderId, isTyping: true }]);

    try {
      const reply = await api.chat(pageUrl, input);
      
      // 🔑 CRITICAL FIX: Robust check for the reply string
      if (reply && typeof reply === 'string') {
        const cleanReply = formatResponse(reply);
        simulateStreaming(cleanReply, placeholderId);
      } else {
        // Handle cases where reply is an object or missing
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((m) =>
        m.map((msg) => (msg.id === placeholderId ? { 
          ...msg, 
          text: "NEURAL_LINK_ERROR: Unable to process request.", 
          isTyping: false 
        } : msg))
      );
      setLoading(false);
    }
  };

  if (!isReady) return <div style={{ color: "#444", textAlign: "center", padding: "40px", fontSize: "11px", letterSpacing: "2px" }}>WAITING_FOR_INDEX...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#050505", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        div::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .code-block { background: #000; border: 1px solid #222; padding: 10px; border-radius: 6px; font-family: monospace; color: #00C6FF; margin: 10px 0; overflow-x: auto; }
      `}</style>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%", animation: "slideIn 0.3s ease-out" }}>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#1A1A1A" : "transparent",
                borderLeft: msg.role === "assistant" ? "2px solid #007AFF" : "1px solid #333",
                color: msg.role === "user" ? "#FFF" : "#CCC",
                fontSize: "13px",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                position: "relative"
              }}
            >
              {/* Check for code blocks and style them */}
              {msg.text.includes("```") ? (
                msg.text.split("```").map((part, i) => (
                  i % 2 === 1 ? <div key={i} className="code-block">{part.replace(/^[a-z]+/i, '')}</div> : part
                ))
              ) : msg.text}
            </div>

            {msg.role === "assistant" && !msg.isTyping && (
              <button
                onClick={() => handleCopy(msg.text, msg.id)}
                style={{
                  marginTop: "10px",
                  background: copyStatus[msg.id] ? "#007AFF" : "#111",
                  border: "1px solid #222",
                  color: copyStatus[msg.id] ? "#FFF" : "#888",
                  fontSize: "10px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "flex",
                  gap: "6px",
                  textTransform: "uppercase",
                  fontWeight: "bold"
                }}
              >
                {copyStatus[msg.id] ? "✓ COPIED" : "❐ COPY_CODE"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "20px", background: "linear-gradient(to top, #000, transparent)" }}>
        <div style={{ position: "relative" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="SYSTEM_INPUT_..."
            style={{
              width: "100%",
              background: "#0A0A0A",
              border: "1px solid #1A1A1A",
              borderRadius: "10px",
              padding: "16px 50px 16px 20px",
              color: "#007AFF",
              outline: "none",
              fontSize: "13px",
              fontFamily: "inherit"
            }}
          />
          <button
            onClick={ask}
            disabled={loading}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: loading ? "#222" : "#007AFF",
              cursor: "pointer",
              fontSize: "20px"
            }}
          >
            {loading ? "..." : "▶"}
          </button>
        </div>
      </div>
    </div>
  );
}