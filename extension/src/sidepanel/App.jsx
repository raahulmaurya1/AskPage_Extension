import { useState } from "react";
import Chat from "./components/Chat";
import { api } from "../utils/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [pageUrl, setPageUrl] = useState(null);

  const analyzePage = async () => {
    setLoading(true);
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.sendMessage(
        tab.id,
        { action: "EXTRACT_PAGE" },
        async (response) => {
          if (response?.text && response?.url) {
            await api.indexPage(response.url, response.text);
            setPageUrl(response.url); 
            setReady(true);
          }
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Analysis failed", err);
      setLoading(false);
    }
  };

  // --- Premium Futuristic UI Styles ---
  const styles = {
    container: {
      backgroundColor: "#050505", // Deep black background
      height: "100vh",
      minWidth: "360px",
      width: "100%",
      padding: "20px",
      fontFamily: "'JetBrains Mono', monospace", // Matching the Chat component
      color: "#EEE",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      boxSizing: "border-box",
      overflow: "hidden"
    },
    header: {
      padding: "10px 5px",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "2px",
      color: "#007AFF",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      borderBottom: "1px solid #1A1A1A"
    },
    glassCard: {
      background: "rgba(20, 20, 20, 0.6)",
      backdropFilter: "blur(10px)", // Glassmorphism
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #222",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.4s ease"
    },
    analyzeBtn: {
      width: "100%",
      padding: "16px",
      borderRadius: "8px",
      border: "none",
      background: loading 
        ? "#111" 
        : "linear-gradient(90deg, #007AFF, #00C6FF)", // Cyber blue gradient
      color: loading ? "#444" : "#fff",
      fontSize: "12px",
      fontWeight: "bold",
      letterSpacing: "1px",
      cursor: loading ? "not-allowed" : "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      position: "relative",
      overflow: "hidden"
    },
    spinner: {
      width: "14px",
      height: "14px",
      border: "2px solid rgba(255,255,255,0.1)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          
          /* Glowing Pulse for the lander */
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(0, 122, 255, 0.2); }
            50% { box-shadow: 0 0 20px rgba(0, 122, 255, 0.6); }
            100% { box-shadow: 0 0 5px rgba(0, 122, 255, 0.2); }
          }

          .btn-premium {
            animation: ${ready ? 'none' : 'glow 2s infinite ease-in-out'};
          }

          .btn-premium:hover {
            filter: brightness(1.2);
            transform: scale(1.02);
          }

          .btn-premium:active {
            transform: scale(0.98);
          }

          * { box-sizing: border-box; }
        `}
      </style>

      <header style={styles.header}>
        <div style={{ 
          width: 10, 
          height: 10, 
          backgroundColor: "#007AFF", 
          borderRadius: "2px",
          boxShadow: "0 0 10px #007AFF" 
        }}></div>
        <span>Neural_Reader v1.0</span>
      </header>

      {/* Main Action Area */}
      {!ready && (
        <div style={styles.glassCard}>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '15px', textAlign: 'center' }}>
            READY_FOR_INJECTION
          </p>
          <button
            onClick={analyzePage}
            disabled={loading}
            style={styles.analyzeBtn}
            className="btn-premium"
          >
            {loading && <div style={styles.spinner}></div>}
            {loading ? "FETCHING_DATA..." : "START_CORE_ANALYSIS"}
          </button>
        </div>
      )}

      {/* Chat Space - Seamless integration */}
      <div style={{ 
        ...styles.glassCard, 
        flexGrow: 1, 
        overflow: "hidden", 
        padding: "0px", // Let Chat handle its own internal padding
        marginTop: ready ? "0" : "5px",
        border: ready ? "1px solid #007AFF" : "1px solid #222" // Glow border when ready
      }}>
        <Chat isReady={ready} pageUrl={pageUrl} />
      </div>

      <footer style={{ textAlign: 'center', fontSize: '9px', color: '#333', marginTop: '10px' }}>
        SECURE_CONNECTION_ESTABLISHED // 2026
      </footer>
    </div>
  );
}